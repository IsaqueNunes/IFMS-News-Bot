const { Client, Collection } = require('discord.js');

const fs = require('fs');
const client = new Client({ intents: 32767 });

client.commands = new Collection();

const handlers = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./commands');


(async () => {
	for (const file of handlers) {
		require(`./handlers/${file}`)(client);
	}
	client.handleEvents(eventFiles, './events');
	client.handleCommands(commandFolders, './commands');
	client.login(process.env.TOKEN);
})();
