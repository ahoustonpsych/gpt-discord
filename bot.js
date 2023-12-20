const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config');
const handleCommand = require('./utils/handleCommand');
const gptReplyHandler = require('./gptReplyHandler'); // Import the reply handler

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.startsWith(config.PREFIX)) {
        processCommand(message);
    } else if (message.reference) {
        await processReply(message);
    }
});

async function processCommand(message) {
    const [command, ...args] = message.content.trim().substring(config.PREFIX.length).split(/\s+/);
    handleCommand(command.toLowerCase(), message, args);
}

async function processReply(message) {
    if (message.reference.messageId) {
        const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
        if (referencedMessage.author.id === client.user.id) {
            gptReplyHandler.handleReply(message);
        }
    }
}

client.login(config.DISCORD_TOKEN);
