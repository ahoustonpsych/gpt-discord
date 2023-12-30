const openaiClient = require('../clients/openaiClient');
const { Storage } = require('@google-cloud/storage');
const { handleErrors, sendTemporaryMessage } = require('../utils/botUtils');
const https = require('https');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

// Initialize Google Cloud Storage client
const storage = new Storage();
const bucketName = 'ahouston-dalle';

async function dalleHandler(message, args) {
    try {
        const { promptText, size, n, quality } = parseArgs(args);
        const tempMessageText = `Image count set to ${n}. Size set to ${size}.`;
        await sendTemporaryMessage(message.channel, `Processing your request... ${tempMessageText}`);

        const publicImageUrl = await generateAndUploadImage(promptText, n, size, quality);
        await message.reply({ content: `Here is your generated image: ${publicImageUrl}` });
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

async function generateAndUploadImage(promptText, n, size, quality) {
    const response = await openaiClient.images.generate({
        model: "dall-e-3",
        prompt: promptText,
        n,
        size,
        ...(quality && { quality })
    });

    const imageUrl = response.data[0].url;
    const fileName = `dalle-generated-${Date.now()}.png`;

    const file = storage.bucket(bucketName).file(fileName);
    const fileWriteStream = file.createWriteStream({
        metadata: {
            contentType: 'image/png',
        },
    });

    await new Promise((resolve, reject) => {
        https.get(imageUrl, (response) => {
            response.pipe(fileWriteStream)
                .on('error', reject)
                .on('finish', resolve);
        }).on('error', reject);
    });

    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
}

module.exports = dalleHandler;
