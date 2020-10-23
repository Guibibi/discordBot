module.exports = {
	name: 'leave',
	args: false,
	usage: 'leave',
	description: 'Leave the current voice channel',
	execute(message, args) {
		if (!message.guild) return console.log('Need to be in a server.');

		if (message.member.voice.channel) {
			const connection = message.member.voice.channel.leave();
		} else {
			message.reply('You need to join a voice channel first!');
		}
	}
};
