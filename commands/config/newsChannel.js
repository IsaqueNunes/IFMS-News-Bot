const { SlashCommandBuilder } = require('@discordjs/builders');
let config = require('../../config.json');
const fs = require('fs');
const fileName = 'config.json';

let json = JSON.stringify(config);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('newschannel')
		.setDescription('set your news channel'),
	async execute(interaction) {

		fs.readFile(fileName, 'utf8', (err, data) => {
			if (err) {
				console.log(err);
			}
			else {
				config = JSON.parse(data);
				config.newsChannel = interaction.channelId;
				json = JSON.stringify(config);
				fs.writeFile(fileName, json, 'utf-8', err => console.log(err));
			}
		});

		console.log(interaction.channelId);
	},
};

