const { getGptResponse, updateConversationHistory, formatConversationForGpt, updateAndLogConversation, handleErrors } = require('./utils/botUtils');
const getOrCreateConversation = require('./utils/conversations');

async function handleReply(message) {
    const userId = message.author.id;
    const userMessage = message.content;

    // Retrieve or create a new conversation object for the user.
    const conversation = getOrCreateConversation(userId);

    // Update the conversation history with the user's reply.
    updateConversationHistory(conversation, 'user', userMessage);

    // Format the conversation history for GPT response generation.
    const formattedMessages = formatConversationForGpt(conversation);

    try {
        // Get a response from the GPT model.
        const reply = await getGptResponse("gpt-4", formattedMessages);

        // Update the conversation history with the assistant's reply.
        updateConversationHistory(conversation, 'assistant', reply);

        // Log the updated conversation state.
        updateAndLogConversation(conversation, message.author.username);

        // Send the GPT response back to the user.
        await message.reply(reply);
    } catch (error) {
        // Handle any errors that occur during processing.
        console.error(`Error handling reply from user ${userId}:`, error);
        handleErrors(message, error);
    }
}

module.exports = { handleReply };
