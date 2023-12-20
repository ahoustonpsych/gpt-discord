const openaiClient = require('../clients/openaiClient');

async function helloHandler(message, args) {
    const currentTime = new Date().toLocaleTimeString();
    message.channel.send(`Hello! The current time is ${currentTime}`);
}

module.exports = helloHandler;