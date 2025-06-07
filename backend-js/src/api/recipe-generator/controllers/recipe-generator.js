'use strict';

const { OpenAI } = require('openai');

let openai;

// Cette condition est la clé : 'openai' ne sera initialisé que si MOCK_OPENAI_API n'est PAS 'true'
if (process.env.MOCK_OPENAI_API !== 'true') {
  console.log("Using Real OpenAI Client for recipe generation.");
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.log("MOCK_OPENAI_API is 'true'. Real OpenAI client will not be initialized.");
}


module.exports = {
  async generate(ctx) {
    const { ingredients } = ctx.request.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return ctx.badRequest('Ingredients must be an array of strings.');
    }

    // --- DÉBUT DE LA LOGIQUE DE SIMULATION (MOCK) ---
    // Cette section sera exécutée si MOCK_OPENAI_API est 'true'
    if (process.env.MOCK_OPENAI_API === 'true') { // <--- C'EST CETTE CONDITION QUI VA SE DÉCLENCHER SUR RENDER
      console.log('Mode MOCK API OpenAI activé. Pas d\'appel réel à OpenAI.');
      const mockRecipe = {
        title: "Recette Mockée - Poulet Brocoli Express",
        description: "Une délicieuse recette générée pour le développement, sans coût OpenAI !",
        ingredients: [
          "200g de poulet (simulé)",
          "1 tête de brocoli (simulé)",
          "Sauce soja (simulée)",
          "Gingembre (simulé)",
          "Un peu d'imagination (indispensable)"
        ],
        instructions: [
          "Étape 1: Mettez tous les ingrédients simulés dans une poêle imaginaire.",
          "Étape 2: Remuez avec enthousiasme pendant quelques minutes.",
          "Étape 3: Servez chaud et dégustez votre plat de développement !"
        ]
      };
      await new Promise(resolve => setTimeout(resolve, 500));
      return ctx.body = { recipe: mockRecipe };
    }
    // --- FIN DE LA LOGIQUE DE SIMULATION (MOCK) ---

    // --- LOGIQUE RÉELLE DE L'API OpenAI (ne s'exécutera PAS si MOCK_OPENAI_API est 'true') ---
    if (!openai) { // Sécurité, mais ne devrait pas être atteinte si MOCK_OPENAI_API est 'true'
        console.error("Erreur: Le client OpenAI n'a pas été initialisé et le mode mock est désactivé.");
        return ctx.internalServerError('OpenAI client not initialized. Check MOCK_OPENAI_API env var.');
    }

    const model = 'gpt-3.5-turbo';
    const prompt = `Generate a unique and delicious recipe with the following ingredients: ${ingredients.join(', ')}.
    The recipe should include:
    1. A catchy title.
    2. A brief description (1-2 sentences).
    3. A list of all ingredients (including common pantry staples like salt, pepper, oil if needed).
    4. Step-by-step instructions.
    Format the output as a JSON object with keys: title, description, ingredients (array of strings), and instructions (array of strings).`;

    try {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
      });

      const generatedContent = completion.choices[0].message.content;
      const parsedRecipe = JSON.parse(generatedContent);

      ctx.body = { recipe: parsedRecipe };

    } catch (error) {
      console.error('Error generating recipe:', error);
      if (error.response) {
        console.error('OpenAI API error response:', error.response.data);
        return ctx.internalServerError('Error from OpenAI API.', { details: error.response.data });
      } else {
        return ctx.internalServerError('Failed to generate recipe.', { details: error.message });
      }
    }
  },
};