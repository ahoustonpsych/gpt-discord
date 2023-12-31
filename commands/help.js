async function helpHandler(message, args) {
    const helpText = {
        dalle: '**!dalle [prompt] [options]**\n*Generates an image based on the prompt. Options: `q=hd` (high definition), `size=[1024x1024, 1024x1792, 1792x1024]`.*',
        gpt: '**!gpt [query]**\n*Processes your query using GPT. Maintains a conversation context for up to five exchanges.*',
        gptvoice: '**!gptvoice [text]**\n*Converts text to speech using GPT.*',
        hello: '**!hello**\n*Responds with a greeting and the current time.*',
        help: '**!help [command]**\n*Shows help for all commands or a specific command.*',
    };

    const allCommandsHelp = `**Available Commands:**\n${Object.keys(helpText).map(command => helpText[command]).join('\n\n')}`;
    const specificCommandHelp = command => `**Usage:**\n${helpText[command]}`;

    if (args.length === 0) {
        await message.channel.send(allCommandsHelp);
    } else {
        const command = args[0].toLowerCase();
        const response = helpText[command] ? specificCommandHelp(command) : `*No help available for command: ${command}*`;
        await message.channel.send(response);
    }
}

module.exports = helpHandler;
