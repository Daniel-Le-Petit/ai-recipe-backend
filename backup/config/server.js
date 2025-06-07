import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function run() {
  const completion = await openai.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Bonjour !" }],
  });
  console.log(completion.data.choices[0].message);
}

run();
