const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config');
const handleCommand = require('./utils/handleCommand');
const { handleReply } = require('./gptReplyHandler'); // Import the reply handler

console.log(config);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    console.log('processing message...')

    if (message.content.startsWith(config.PREFIX)) {
        await processCommand(message);
    } else if (message.reference) {
        await processReply(message);
    }
});

async function processCommand(message) {
    const [command, ...args] = message.content.trim().substring(config.PREFIX.length).split(/\s+/);
    console.log('command, args:', command, ...args)
    handleCommand(command.toLowerCase(), message, args);
}

async function processReply(message) {
    if (message.reference.messageId) {
        const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
        if (referencedMessage.author.id === client.user.id) {
            await handleReply(message);
        }
    }
}

client.login(config.DISCORD_TOKEN);
