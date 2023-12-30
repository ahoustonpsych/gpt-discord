const { getGptResponse, updateConversationHistory, formatConversationForGpt, handleErrors } = require('../utils/botUtils');
const getOrCreateConversation = require('../utils/conversations');

async function gptHandler(message, args) {
    const userId = message.author.id;
    const userMessage = args.join(' ');

    try {
        console.log(`Handling message from user ${userId}: ${userMessage}`);

        const conversation = getOrCreateConversation(userId);
        console.log(`Retrieved or created conversation for user ${userId}`);

        updateConversationHistory(conversation, 'user', userMessage);
        console.log(`Updated conversation history with user's message`);

        const formattedMessages = formatConversationForGpt(conversation);
        console.log(`Formatted conversation for GPT: ${JSON.stringify(formattedMessages)}`);

        const model = "gpt-4";
        const reply = await getGptResponse(model, formattedMessages);
        console.log(`Received GPT response: ${reply}`);

        updateConversationHistory(conversation, 'assistant', reply);
        console.log(`Updated conversation history with assistant's reply`);

        await message.reply(reply);
        console.log(`Replied to user ${userId}`);
    } catch (error) {
        console.error(`Error handling message from user ${userId}:`, error);
        handleErrors(message, error);
    }
}

module.exports = gptHandler;
