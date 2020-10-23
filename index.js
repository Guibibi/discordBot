const config = require('./config.json');
const Discord = require('discord.js');
const prefix = config.prefix;
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

// Get the commands
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

// Ready the client
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

// Loop through all the commands.
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

//Listen to the message event
client.on('message', (message) => {
	// Check if the message start with the '$' prefix
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// Convert our command to lowercase and split them
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Check if command exist
	if (!client.commands.has(commandName)) return console.log(`Command '${commandName}' doesn't exist!`);

	// Get the command from the client.commands collection
	const command =
		client.commands.get(commandName) ||
		client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return console.log(`Command '${commandName}' doesn't exist!`);

	// Check if the commands needs arguments, else send an error message.
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	// Cooldown protection
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(
				`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
			);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	// Execute the command.
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

// Login the bot
client.login(config.token).catch((err) => console.log(err));