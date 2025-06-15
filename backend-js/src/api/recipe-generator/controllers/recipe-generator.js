'use strict';

/**
 * recipe-generator controller
 */

module.exports = {
  async generate(ctx) {
    // Récupération des préférences envoyées par le frontend
    const {
      cuisineType,
      numPeople,
      maxDuration,
      difficulty,
      ingredients, // Reçu du frontend, peut être une chaîne "tomate, oignon"
      maxIngredients,
      recipeGoal,
      robotCompatible,
      actionType // 'generateAI' ou 'searchExisting'
    } = ctx.request.body;

    let selectedRecipe = null;

    if (actionType === 'generateAI') {
      // --- LOGIQUE DE GÉNÉRATION IA AVEC L'API GEMINI ---
      try {
        // Construction du prompt pour l'API Gemini
        // On demande une recette au format JSON pour faciliter le parsing
        const prompt = `Génère une recette de cuisine unique en format JSON. 
La recette doit être de type '${cuisineType || 'varié'}', pour ${numPeople || 2} personne(s), 
avec une durée maximale de ${maxDuration || 60} minutes, un niveau de difficulté '${difficulty || 'Facile'}'.
Les ingrédients souhaités sont : ${ingredients.join(', ') || 'aucun ingrédient spécifique'}.
L'objectif principal de cette recette est : ${recipeGoal || 'un plat équilibré et savoureux'}.

Le JSON doit contenir les champs suivants :
- "title": (string) Le titre de la recette.
- "duration": (string) La durée totale de la préparation (ex: "30 minutes").
- "ingredients": (array of objects) Chaque objet doit avoir "name" (string) et "quantity" (string).
- "steps": (array of strings) Les étapes détaillées de la recette.
- "robotCompatible": (boolean) true si la recette peut être facilement faite avec un robot de cuisine, false sinon.
- "aiTested": (boolean) Toujours true.
- "imageUrl": (string) Utilise cette URL placeholder: "https://placehold.co/600x400/FF5733/FFFFFF?text=Generated+Recipe".

Retourne UNIQUEMENT le JSON de la recette.`;

        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });

        // Configuration pour la génération JSON par Gemini
        const payload = {
          contents: chatHistory,
          generationConfig: {
            responseMimeType: "application/json",
            // Un schéma JSON plus précis pourrait être ajouté ici si Gemini le supporte directement pour un modèle donné
            // Pour gemini-2.0-flash, la demande explicite de JSON dans le prompt est souvent suffisante.
          }
        };

        const apiKey = ""; // La clé API sera fournie par l'environnement Canvas
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!geminiResponse.ok) {
          const errorText = await geminiResponse.text();
          console.error("Erreur API Gemini:", errorText);
          throw new Error(`Erreur lors de l'appel à l'API Gemini: ${geminiResponse.status} - ${errorText}`);
        }

        const geminiResult = await geminiResponse.json();
        console.log("Réponse brute de Gemini:", JSON.stringify(geminiResult, null, 2));

        let generatedContentText = '';
        if (geminiResult.candidates && geminiResult.candidates.length > 0 &&
            geminiResult.candidates[0].content && geminiResult.candidates[0].content.parts &&
            geminiResult.candidates[0].content.parts.length > 0) {
          generatedContentText = geminiResult.candidates[0].content.parts[0].text;
        } else {
          throw new Error("Réponse de Gemini inattendue ou vide.");
        }

        // Essayer de parser le JSON reçu de Gemini
        let parsedRecipe;
        try {
          parsedRecipe = JSON.parse(generatedContentText);
        } catch (jsonParseError) {
          console.error("Erreur de parsing JSON de la réponse Gemini:", jsonParseError);
          // Tenter une extraction si le JSON est malformé ou non valide
          parsedRecipe = extractRecipeFromText(generatedContentText, {
            cuisineType, numPeople, maxDuration, difficulty, robotCompatible
          });
          if (!parsedRecipe.title) { // Fallback si même l'extraction ne donne rien de bon
            throw new Error("Impossible de parser ou d'extraire la recette de la réponse de l'IA.");
          }
        }

        // Assurez-vous que les données parsées correspondent au schéma Strapi
        const recipeDataToSave = {
          title: parsedRecipe.title || 'Recette Générée par IA',
          duration: parsedRecipe.duration || `${maxDuration} minutes`,
          ingredients: JSON.stringify(parsedRecipe.ingredients || []), // Stocker comme JSON string pour Array d'Objets
          steps: JSON.stringify(parsedRecipe.steps || []), // Stocker comme JSON string pour Array de Strings
          cuisineType: cuisineType,
          numPeople: numPeople,
          maxDuration: maxDuration,
          difficulty: difficulty,
          robotCompatible: parsedRecipe.robotCompatible,
          aiTested: true, // Toujours true si généré par Gemini
          imageUrl: parsedRecipe.imageUrl || "https://placehold.co/600x400/FF5733/FFFFFF?text=Generated+Recipe",
          source: "IA Gemini"
        };
        
        console.log("Données de recette prêtes à être sauvegardées:", recipeDataToSave);

        // ENREGISTRE LA RECETTE DANS 'api::recipie.recipie'
        selectedRecipe = await strapi.entityService.create('api::recipie.recipie', {
          data: recipeDataToSave,
        });
        console.log("Recette générée par Gemini enregistrée dans la BD:", selectedRecipe);

      } catch (error) {
        console.error("Erreur lors de la génération ou de l'enregistrement de la recette IA:", error);
        ctx.badRequest(error.message || 'Erreur lors de la génération de la recette IA.');
        return;
      }

    } else if (actionType === 'searchExisting') {
      // --- LOGIQUE DE RECHERCHE DE RECETTES EXISTANTES (DANS LA BD) ---
      if (!ingredients || ingredients.length === 0) {
        ctx.badRequest('Veuillez fournir des ingrédients pour la recherche.');
        return;
      }

      // Convertit les ingrédients de recherche en tableau de chaînes en minuscules
      const requestedIngredientsLower = Array.isArray(ingredients) ?
                                        ingredients.map(i => i.toLowerCase()) :
                                        String(ingredients).split(',').map(item => item.trim().toLowerCase()).filter(item => item.length > 0);

      try {
        // Recherche des recettes dans la base de données Strapi
        // NOTE: La recherche sur des champs JSON (comme 'ingredients') est complexe.
        // Pour une recherche plus robuste, Strapi ne supporte pas nativement une recherche sur tous les éléments d'un tableau JSON.
        // Vous pouvez rechercher si la chaîne JSON CONTIENT un des ingrédients demandés,
        // ou ajouter un champ texte séparé pour les mots-clés d'ingrédients pour faciliter la recherche.
        
        // Exemple de filtre de recherche simple: recherche si la description JSON des ingrédients contient le premier ingrédient demandé
        let filters = {
          $or: [
            // Filtre optionnel par type de cuisine si fourni
            cuisineType ? { cuisineType: { $eq: cuisineType } } : undefined,
            // Filtre optionnel par difficulté si fournie
            difficulty ? { difficulty: { $eq: difficulty } } : undefined,
          ].filter(Boolean), // Supprime les éléments undefined du tableau
        };

        // Ajoute un filtre pour les ingrédients si la liste n'est pas vide
        if (requestedIngredientsLower.length > 0) {
            // Strapi nécessite une chaîne pour $containsi sur un champ JSON,
            // ce qui limite la recherche à la présence d'une sous-chaîne dans la représentation TEXTUELLE du JSON.
            // Une recherche plus avancée nécessiterait des relations ou une extension de l'API.
            filters.ingredients = { $containsi: requestedIngredientsLower[0] }; 
        }

        const foundRecipes = await strapi.entityService.find('api::recipie.recipie', { 
          filters: filters,
          limit: 1, // Limite la recherche à la première recette trouvée
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
      // Retourne la recette générée/trouvée
      return { recipe: selectedRecipe };
    } else {
      // Cas où aucune recette n'a été traitée (par ex. si la logique est tombée à travers)
      ctx.badRequest('Aucune recette traitée.'); 
    }
  },

  // NOUVELLES MÉTHODES POUR LES DONNÉES D'ADMINISTRATION
  async getAdminStats(ctx) {
    // Vérification temporairement désactivée pour le développement
    // if (!ctx.state.user || !ctx.state.user.isAdmin) {
    //   return ctx.unauthorized('Vous n\'avez pas les permissions nécessaires pour accéder aux statistiques.');
    // }

    // Données statistiques mockées (remplacez par des requêtes réelles à votre BD)
    const stats = {
      totalUsers: 1500,
      activeUsersToday: 42,
      recipesGeneratedLastMonth: 5000,
      mostPopularCuisine: 'Méditerranéenne',
      averageSessionDuration: '03:45', // En minutes:secondes
      pageViewsLastMonth: 12450,
      uniquePageViewsLastMonth: 8700,
    };

    return stats;
  },

  async getUserLocations(ctx) {
    // Vérification temporairement désactivée pour le développement
    // if (!ctx.state.user || !ctx.state.user.isAdmin) {
    //   return ctx.unauthorized('Vous n\'avez pas les permissions nécessaires pour accéder à la localisation des utilisateurs.');
    // }

    // Données de localisation mockées
    const locations = {
      totalUsers: 300,
      countries: {
        France: 120,
        USA: 80,
        UK: 50,
        Japan: 50
      },
      coordinates: [ // Exemple de coordonnées (pourrait être plus granulaire)
        { lat: 48.8566, lon: 2.3522, city: 'Paris', users: 120 },
        { lat: 34.0522, lon: -118.2437, city: 'Los Angeles', users: 80 },
        { lat: 51.5074, lon: -0.1278, city: 'London', users: 95 },
        { lat: 35.6895, lon: 139.6917, city: 'Tokyo', users: 70 },
      ]
    };

    return locations;
  },

  async getFeatureUsage(ctx) {
    // Vérification temporairement désactivée pour le développement
    // if (!ctx.state.user || !ctx.state.user.isAdmin) {
    //   return ctx.unauthorized('Vous n\'avez pas les permissions nécessaires pour accéder à l\'utilisation des fonctionnalités.');
    // }

    // Données d'utilisation des fonctionnalités mockées
    const usage = {
      aiGenerationPercentage: 75, descriptionAI: 'Utilisé régulièrement',
      searchExistingPercentage: 50, descriptionSearch: 'Utilisé souvent',
      exploreInspirationalRecipesPercentage: 60, descriptionExplore: 'Exploré',
      viewMyRecipesPercentage: 30, descriptionMyRecipes: 'Consultent leurs recettes',
      addToCartPercentage: 40, descriptionAddToCart: 'Ajoutent au panier',
      exportToRobotPercentage: 15, descriptionExportRobot: 'Exportent pour robot',
    };

    return usage;
  },
};

// Fonction utilitaire pour extraire la recette si Gemini ne renvoie pas un JSON parfait
function extractRecipeFromText(text, fallbackData) {
  const recipe = {};
  
  // Tentative d'extraction de JSON si le texte brut contient du JSON
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch && jsonMatch[1]) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.warn("Could not parse JSON block from Gemini, falling back to text extraction:", e);
    }
  }

  // Fallback: extraction rudimentaire à partir du texte brut
  recipe.title = text.match(/Titre:\s*(.+)/)?.[1] || fallbackData.cuisineType + ' Recette IA';
  recipe.duration = text.match(/Durée:\s*(.+)/)?.[1] || `${fallbackData.maxDuration} minutes`;
  
  const ingredientsMatch = text.match(/Ingrédients:\s*([\s\S]+?)(?=Étapes:|\n\n)/);
  if (ingredientsMatch && ingredientsMatch[1]) {
    recipe.ingredients = ingredientsMatch[1].split('\n').map(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const parts = trimmedLine.substring(2).split(':');
        return {
          name: parts[0] ? parts[0].trim() : 'Inconnu',
          quantity: parts[1] ? parts[1].trim() : 'Quantité inconnue'
        };
      }
      return null;
    }).filter(Boolean);
  } else {
    recipe.ingredients = [{ name: "Ingrédients non spécifiés", quantity: "N/A" }];
  }

  const stepsMatch = text.match(/Étapes:\s*([\s\S]+)/);
  if (stepsMatch && stepsMatch[1]) {
    recipe.steps = stepsMatch[1].split('\n').map(step => step.trim()).filter(step => step.length > 0 && !step.startsWith('- '));
  } else {
    recipe.steps = ["Étapes non spécifiées."];
  }
  
  recipe.robotCompatible = fallbackData.robotCompatible || false;
  recipe.aiTested = true;
  recipe.imageUrl = "https://placehold.co/600x400/FF5733/FFFFFF?text=Generated+Recipe";

  return recipe;
}

