const MAX_EXCHANGES = 5;

function createUniqueId(userId) {
    return `${userId}-${Date.now()}`;
}

function startNewConversation(userId) {
    return {
        id: createUniqueId(userId),
        history: [],
    };
}

function updateConversationHistory(conversation, role, content) {
    if (conversation.history.length >= MAX_EXCHANGES * 2) {
        conversation.history.shift(); // Remove oldest message
    }
    conversation.history.push({ role, content });
}

function getConversationContext(conversation) {
    return conversation.history.slice(-Math.min(conversation.history.length, MAX_EXCHANGES * 2));
}

module.exports = {
    startNewConversation,
    updateConversationHistory,
    getConversationContext
};
