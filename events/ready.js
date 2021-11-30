const axios = require('axios').default;
const DomParser = require('dom-parser');
const { MessageEmbed } = require('discord.js');

const parser = new DomParser();
const { newsChannel } = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		requestNews(client);

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};


async function requestNews(client) {
	let buffer;

	setInterval(() => {
		if (newsChannel) {
			axios
				.get('https://ifms.edu.br/noticias')
				.then((response) => {
					const document = parser.parseFromString(response.data);

					const newsData = [];

					document.getElementsByClassName('tileItem').forEach((item) => {
						newsData.push({
							subtitle: item.getElementsByClassName('subtitle')[0].textContent,
							titles: item.getElementsByClassName('summary url')[0].textContent,
							url: item.getElementsByClassName('summary url')[0].getAttribute('href'),
							description: item.getElementsByClassName('description')[0].textContent,
							image: item.getElementsByClassName('tileImage')[0].getElementsByTagName('img')[0].getAttribute('src'),
						});
					});

					let i = 0;

					while (!compareObject(newsData[i], buffer) && i < 3) {
						client.channels.fetch(newsChannel)
							.then(channel => {
								const embed = new MessageEmbed()
									.setURL(newsData[i - 1].url)
									.setTitle(newsData[i - 1].titles)
									.setDescription(newsData[i - 1].description)
									.setThumbnail(newsData[i - 1].image)
									.setFooter(newsData[i - 1].subtitle)
									.setColor('#00420C');
								channel.send({ embeds: [embed] });
								i--;
							})
							.catch(console.error);
						i++;
					}

					buffer = newsData[0];
				})
				.catch(console.error);
		}
		else {
			console.log('channel not found');
		}
	}, 3.6e+6);
	// 7.2e+6
}

function compareObject(obj1, obj2) {
	return JSON.stringify(obj1) == JSON.stringify(obj2);
}
