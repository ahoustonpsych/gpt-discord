const openaiClient = require('../clients/openaiClient');
const { handleErrors, sendTemporaryMessage } = require('../utils/botUtils');

async function dalleHandler(message, args) {
    try {
        const { promptText, size, n, quality } = parseArgs(args);
        const tempMessageText = `Image count set to ${n}. Size set to ${size}.`;
        await sendTemporaryMessage(message.channel, `Processing your request... ${tempMessageText}`);

        const imageUrl = await generateImage(promptText, n, size, quality);
        await message.reply({ content: `Here is your generated image: ${imageUrl}` });
    } catch (error) {
        handleErrors(message, error);
    }
}

function parseArgs(args) {
    let promptText = args.join(' ');
    let n = 1;
    let quality;
    let size = "1024x1024";

    if (promptText.includes('q=hd')) {
        quality = 'hd';
        n = Math.min(n, 5);
        promptText = promptText.replace('q=hd', '').trim();
    }

    const sizeMatch = promptText.match(/size=(1024x1024|1024x1792|1792x1024)/);
    if (sizeMatch && sizeMatch[1]) {
        size = sizeMatch[1];
        promptText = promptText.replace(sizeMatch[0], '').trim();
    }

    return { promptText, size, n, quality };
}

async function generateImage(promptText, n, size, quality) {
    const response = await openaiClient.images.generate({
        model: "dall-e-3",
        prompt: promptText,
        n,
        size,
        ...(quality && { quality })
    });

    return response.data[0].url;
}

module.exports = dalleHandler;