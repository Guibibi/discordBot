module.exports = {
	name: 'join',
	args: false,
	usage: 'join',
	description: 'Join the current voice channel',
	async execute(message, args) {
		if (!message.guild) return console.log('Need to be in a server.');
		let connection = null;

		if (message.member.voice.channel) {
			connection = message.member.voice.channel.join();
		} else {
			message.reply('You need to join a voice channel first!');
		}
	}
};
