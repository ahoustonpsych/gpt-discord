const { getGptResponse, getOrCreateConversation, updateConversationHistory, formatConversationForGpt, updateAndLogConversation, handleErrors } = require('./utils/botUtils');
const { conversations } = require('./commands/gpt');

async function handleReply(message) {
    const userId = message.author.id;
    const userMessage = message.content;

    const conversation = getOrCreateConversation(conversations, userId);
    updateConversationHistory(conversation, 'user', userMessage);

    const messages = formatConversationForGpt(conversation);
    const reply = await getGptResponse({ model: "gpt-4", messages });

    updateConversationHistory(conversation, 'assistant', reply);
    updateAndLogConversation(conversation, message.author.username);

    await message.reply(reply);
}

module.exports = { handleReply };
