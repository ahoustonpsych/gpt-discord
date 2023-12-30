const MAX_EXCHANGES = 5;
const conversations = {};

function getOrCreateConversation(userId) {
    if (!conversations[userId]) {
        conversations[userId] = { id: userId, history: [] };
    }
    return conversations[userId];
}

function updateConversationHistory(conversation, role, content) {
    if (conversation.history.length >= MAX_EXCHANGES * 2) {
        conversation.history.shift(); // Remove oldest message
    }
    conversation.history.push({ role, content });
}

module.exports = getOrCreateConversation;