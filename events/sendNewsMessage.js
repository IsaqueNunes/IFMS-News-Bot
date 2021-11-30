const io = require('socket.io-client');

module.exports = {
	name: 'sendNewsMessage',
	async execute() {

		console.log('entrou aqui');

		const socket = io('http://localhost:4000');
		socket.on('news_requested', (data) => console.log(data));
		socket.on('new_news_created', (data) => console.log(data));

	},
};
