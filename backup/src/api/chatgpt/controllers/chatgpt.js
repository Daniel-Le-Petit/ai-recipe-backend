'use strict';
const axios = require('axios');

module.exports = {
  async generate(ctx) {
    const { prompt } = ctx.request.body;

    if (!prompt) {
      return ctx.badRequest('Prompt manquant');
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      ctx.send(response.data);
    } catch (error) {
      console.error('Erreur API ChatGPT :', error.message);
      ctx.internalServerError('Erreur API');
    }
  },
};
