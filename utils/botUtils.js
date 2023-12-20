const openaiClient = require('../clients/openaiClient');
const crypto = require('crypto');
const { conversations } = require('../commands/gpt');

const MAX_EXCHANGES = 5;

async function sendTemporaryMessage(channel, content) {
    return await channel.send(content);
}

async function getGptResponse({ model, messages }) {
    const gptResponse = await openaiClient.chat.completions.create({
        model: model,
        messages: messages
    });

    if (gptResponse && gptResponse.choices && gptResponse.choices.length > 0 && gptResponse.choices[0].message.content) {
        return gptResponse.choices[0].message.content.trim();
    } else {
        throw new Error('Invalid GPT response structure');
    }
}

function getOrCreateConversation(conversations, userId) {
    if (!conversations[userId]) {
        conversations[userId] = { id: generateBase64Id(), history: [] };
    }
    return conversations[userId];
}

function updateConversationHistory(conversation, role, content) {
    if (conversation.history.length >= MAX_EXCHANGES * 2) {
        conversation.history.shift(); // Remove oldest message
    }
    conversation.history.push({ role, content });
}

function formatConversationForGpt(conversation) {
    return conversation.history.map(message => {
        return { role: message.role, content: message.content };
    });
}

function updateAndLogConversation(conversation, username) {
    console.log(`ID: ${conversation.id}, User: ${username}, Exchanges: ${conversation.history.length / 2}, History: ${JSON.stringify(conversation.history)}`);
}

function handleErrors(message, error) {
    console.error('Error:', error);

    let replyMessage = 'Sorry, there was an error processing your request.';
    if (error.response && error.response.status === 429) {
        replyMessage = 'I have reached my limit of GPT queries for now. Please try again later.';
    }

    message.reply(replyMessage);
}

function generateBase64Id() {
    return crypto.randomBytes(6).toString('base64').slice(0, 8); // Generate 8 characters Base64 ID
}

module.exports = {
    sendTemporaryMessage,
    getGptResponse,
    getOrCreateConversation,
    updateConversationHistory,
    formatConversationForGpt,
    updateAndLogConversation,
    handleErrors
};
