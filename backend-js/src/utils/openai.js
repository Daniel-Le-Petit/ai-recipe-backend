// src/utils/openai.js
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function run() {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: "Bonjour !" }],
    });
    console.log(completion.data.choices[0].message.content);
  } catch (err) {
    console.error("Erreur OpenAI :", err.response?.data || err.message);
  }
}

run();
