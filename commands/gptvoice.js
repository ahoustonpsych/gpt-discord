const { getGptResponse, handleErrors } = require('../utils/botUtils');
const { synthesizeSpeech, sendReplyWithAttachment, cleanUp } = require('../utils/audioHelpers');

async function gptVoiceHandler(message, args) {
    try {
        const text = args.join(' ');
        const reply = await getGptResponse('gpt-4', [{ role: "user", content: text }]);

        const speechFile = await synthesizeSpeech(reply);
        await sendReplyWithAttachment(message, speechFile);
        await cleanUp(speechFile);
    } catch (error) {
        handleErrors(message, error);
    }
}

module.exports = gptVoiceHandler;
