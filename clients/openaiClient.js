const { OpenAI } = require('openai');
const config = require('../config');

const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
});

module.exports = openai;