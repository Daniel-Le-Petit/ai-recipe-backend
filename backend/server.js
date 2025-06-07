import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}))

app.post('/api/chatgpt', async (req, res) => {
  const { titre, description, ingredients } = req.body

  try {
    const prompt = `Propose une recette avec ce titre, description et ingrédients:\nTitre: ${titre}\nDescription: ${description}\nIngrédients:\n${ingredients}`

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    })

    const suggestion = completion.data.choices[0].message.content
    res.json({ suggestion })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur lors de la génération ChatGPT' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Backend démarré sur http://localhost:${PORT}`)
})
