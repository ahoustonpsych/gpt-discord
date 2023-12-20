const {
    getGptResponse,
    getOrCreateConversation,
    updateConversationHistory,
    formatConversationForGpt,
    updateAndLogConversation,
    handleErrors
} = require('../utils/botUtils');

const conversations = {};

async function gptHandler(message, args) {
    const userId = message.author.id;
    const userMessage = args.join(' ');

    try {
        const conversation = getOrCreateConversation(conversations, userId);
        updateConversationHistory(conversation, 'user', userMessage);

        const messages = formatConversationForGpt(conversation);
        const reply = await getGptResponse({ model: "gpt-4", messages });

        updateConversationHistory(conversation, 'assistant', reply);
        updateAndLogConversation(conversation, message.author.username);

        await message.reply(reply);
    } catch (error) {
        handleErrors(message, error);
    }
}

module.exports = {
    gptHandler,
    conversations
};
