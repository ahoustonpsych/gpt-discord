const dalleHandler = require('../commands/dalle');
const gptHandler = require('../commands/gpt');
const gptVoiceHandler = require('../commands/gptvoice');
const helloHandler = require('../commands/hello');
const helpHandler = require('../commands/help');
// Other imports...

function handleCommand(command, message, args) {
    switch (command) {
        case 'dalle':
            dalleHandler(message, args);
            break;
        case 'gpt':
            console.log('gpt command received')
            gptHandler(message, args);
            break;
        case 'gptvoice':
            gptVoiceHandler(message, args);
            break;
        case 'hello':
            helloHandler(message, args);
            break;
        case 'help':
            helpHandler(message, args);
            break;
    }
}

module.exports = handleCommand;