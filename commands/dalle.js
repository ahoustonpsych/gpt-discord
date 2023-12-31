const openaiClient = require('../clients/openaiClient');
const { handleErrors, sendTemporaryMessage } = require('../utils/botUtils');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { AttachmentBuilder } = require('discord.js');

async function dalleHandler(message, args) {
    let tempMessage;
    try {
        const { promptText, size, n, quality } = parseArgs(args);
        const tempMessageText = `Processing your request...`;
        tempMessage = await sendTemporaryMessage(message.channel, tempMessageText);

        const localImagePath = await generateImage(promptText, n, size, quality);
        const attachment = new AttachmentBuilder(localImagePath).setName('dalle-image.png');
        await message.reply({ files: [attachment] });

        // Clean up the local image file
        fs.unlinkSync(localImagePath);

        // Delete the temporary message
        if (tempMessage) {
            await tempMessage.delete();
        }
    } catch (error) {
        handleErrors(message, error);
        if (tempMessage) {
            await tempMessage.delete();
        }
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

    const imageUrl = response.data[0].url;
    const localFileName = `dalle-generated-${Date.now()}.png`;
    const localFilePath = path.resolve(__dirname, '..', 'temp', localFileName);

    await new Promise((resolve, reject) => {
        https.get(imageUrl, (response) => {
            const fileStream = fs.createWriteStream(localFilePath);
            response.pipe(fileStream)
                .on('finish', resolve)
                .on('error', reject);
        }).on('error', reject);
    });

    return localFilePath;
}

module.exports = dalleHandler;