const openaiClient = require('../clients/openaiClient');

async function helpHandler(message, args) {
    const helpText = {
        dalle: '**!dalle [prompt] [options]** - *Generates an image based on the prompt. Options include `q=hd` for high definition quality and `size=[size]` for image dimensions (1024x1024, 1024x1792, 1792x1024).*',
        gpt: '**!gpt [query]** - *Processes your query using GPT.*',
        gptvoice: '**!gptvoice [text]** - *Converts the given text to speech using GPT.*',
        hello: '**!hello** - *Responds with a greeting and the current time.*',
        help: '**!help [command]** - *Shows help for all commands or a specific command.*',
    };

    if (args.length === 0) {
        // Display help for all commands
        const allCommandsHelp = "**Usage:**\n" + Object.keys(helpText).map(command => helpText[command]).join('\n');
        message.channel.send(allCommandsHelp);
    } else {
        // Display help for a specific command
        const command = args[0].toLowerCase();
        if (helpText[command]) {
            message.channel.send(`**Usage:** ${helpText[command]}`);
        } else {
            message.channel.send(`*No help available for command: ${command}*`);
        }
    }
}

module.exports = helpHandler;