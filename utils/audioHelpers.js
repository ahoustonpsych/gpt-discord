const fs = require('fs');
const path = require('path');
const { AttachmentBuilder } = require('discord.js');
const openai = require('../clients/openaiClient');

async function synthesizeSpeech(text) {
    // Ensure the temp directory exists
    const tempDir = path.resolve(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const speechFile = path.join(tempDir, `speech-${Date.now()}.mp3`);

    try {
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: text,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);
        return speechFile;
    } catch (error) {
        console.error('Error generating speech:', error);
        throw error;
    }
}

async function sendReplyWithAttachment(message, filePath) {
    try {
        const attachment = new AttachmentBuilder(filePath).setName('response.mp3');
        await message.reply({ files: [attachment] });
    } catch (error) {
        console.error('Error sending reply with attachment:', error);
        throw error;
    }
}

function cleanUp(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) console.error(`Error cleaning up file: ${filePath}`, err);
        else console.log(`Cleaned up file: ${filePath}`);
    });
}

module.exports = { synthesizeSpeech, sendReplyWithAttachment, cleanUp };
