const { getGptResponse, handleErrors, synthesizeSpeech, sendReplyWithAttachment, cleanUp } = require('../utils/botUtils');

async function gptVoiceHandler(message, args) {
    try {
        const text = args.join(' ');
        const reply = await getGptResponse([
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: text }
        ]);

        const speechFile = await synthesizeSpeech(reply);
        await sendReplyWithAttachment(message, speechFile);
        await cleanUp(speechFile);
    } catch (error) {
        handleErrors(message, error);
    }
}

module.exports = gptVoiceHandler;
