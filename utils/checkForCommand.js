const validCommands = ['dalle', 'gpt', 'gptvoice', 'hello', 'help'];
function checkForCommand(command) {
    return validCommands.includes(command);
}

module.exports = checkForCommand;