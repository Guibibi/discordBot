module.exports = {
	name: 'join',
	args: false,
	usage: 'join',
	description: 'Join the current voice channel',
	async execute(message, args) {
		if (!message.guild) return console.log('Need to be in a server.');
		let connection = null;

		/* 		if (message.member.voice.channel) {
			connection = message.member.voice.channel.join();
		} else {
			message.reply('You need to join a voice channel first!');
		}
		
		const dispatcher = connection.play('/audio/caliss.mp3');
		 */

		dispatcher.on('start', () => {
			console.log('caliss.mp3 is now playing!');
		});

		dispatcher.once('finish', () => {
			console.log('Finished playing!');
		});

		dispatcher.on('error', console.error);

		dispatcher.destroy();
	}
};
