'use strict';

/**
 * recipe-generator controller
 */

module.exports = {
  async generate(ctx) {
    const {
      cuisineType,
      numPeople,
      maxDuration,
      difficulty,
      ingredients, // Tableau d'ingrédients ou chaîne de caractères
      maxIngredients,
      recipeGoal,
      robotCompatible,
      actionType // Nouveau: 'generateAI' ou 'searchExisting'
    } = ctx.request.body;

    let selectedRecipe = null;
    let recipeDataToSave = null; // Données à sauvegarder ou à rechercher

    if (actionType === 'generateAI') {
      // --- LOGIQUE DE GÉNÉRATION IA (MOCKÉE POUR L'INSTANT) ---
      // Crée une recette mockée, qui sera ensuite enregistrée dans la base de données.
      const mockRecipe = {
        title: `Recette IA Générée: ${cuisineType || 'Variée'}`,
        duration: `${Math.floor(Math.random() * (maxDuration - 20) + 20)} minutes`, // Durée aléatoire
        ingredients: [
          { name: "Ingrédient IA 1", quantity: "quantité IA 1" },
          { name: "Ingrédient IA 2", quantity: "quantité IA 2" },
          { name: "Ingrédient IA 3", quantity: "quantité IA 3" },
          // Ajoutez d'autres ingrédients mockés ici
        ],
        steps: [
          "Étape 1: La recette IA commence par...",
          "Étape 2: Ensuite, combinez les éléments générés par l'IA...",
          "Étape 3: Finalisez la préparation IA.",
        ],
        cuisineType: cuisineType || "Variée",
        numPeople: numPeople || 2,
        maxDuration: maxDuration || 60,
        difficulty: difficulty || "Moyen",
        robotCompatible: robotCompatible || false,
        aiTested: true, // Marque comme "testée par l'IA"
        source: "IA Générée (Mock)", // Indique la source de la recette
        imageUrl: "https://placehold.co/600x400/FF5733/FFFFFF?text=Recette+AI+Image" // Ajout de l'URL d'image de substitution
      };
      recipeDataToSave = mockRecipe;

      try {
        // ENREGISTRE LA RECETTE DANS 'api::recipie.recipie'
        // Assurez-vous que cet API ID correspond EXACTEMENT à votre Collection Type dans Strapi Admin.
        selectedRecipe = await strapi.entityService.create('api::recipie.recipie', { // << CHANGEMENT ICI
          data: recipeDataToSave,
        });
        console.log("Recette IA mockée enregistrée:", selectedRecipe);

      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la recette IA mockée:", error);
        ctx.badRequest('Erreur lors de la génération et de l\'enregistrement de la recette IA.');
        return;
      }

    } else if (actionType === 'searchExisting') {
      // --- LOGIQUE DE RECHERCHE DE RECETTES EXISTANTES PAR INGRÉDIENTS ---
      if (!ingredients || ingredients.length === 0) {
        ctx.badRequest('Veuillez fournir des ingrédients pour la recherche.');
        return;
      }

      const requestedIngredientsLower = Array.isArray(ingredients) ?
                                        ingredients.map(i => i.toLowerCase()) :
                                        [ingredients.toLowerCase()];

      try {
        // Recherche des recettes dans la base de données.
        const foundRecipes = await strapi.entityService.find('api::recipie.recipie', { // << CHANGEMENT ICI
          filters: {
            $or: [
              cuisineType ? { cuisineType: { $eq: cuisineType } } : undefined,
              difficulty ? { difficulty: { $eq: difficulty } } : undefined,
              { ingredients: { $contains: requestedIngredientsLower[0] } }
            ].filter(Boolean),
          },
          limit: 1,
        });

        if (foundRecipes && foundRecipes.length > 0) {
          selectedRecipe = foundRecipes[0];
        } else {
          ctx.notFound('Aucune recette existante trouvée correspondant à vos critères.');
          return;
        }

      } catch (error) {
        console.error("Erreur lors de la recherche de recettes existantes:", error);
        ctx.badRequest('Erreur lors de la recherche de recettes.');
        return;
      }
    } else {
      ctx.badRequest('Type d\'action non valide.');
      return;
    }

    if (selectedRecipe) {
      return { recipe: selectedRecipe };
    } else {
      ctx.badRequest('Aucune recette traitée.');
    }
  },
};
