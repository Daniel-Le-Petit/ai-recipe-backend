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
      // --- LOGIQUE DE GÉNÉRATION IA (MOCKÉE ET ENREGISTRÉE DANS LA BD) ---
      // Cette structure DOIT correspondre EXACTEMENT aux noms et types de champs de votre collection 'recipie' dans Strapi.
      const mockRecipeData = {
        // ID et autres champs générés par Strapi. N'incluez pas 'id', 'createdAt', 'updatedAt', 'publishedAt' ici.
        title: `Recette AI pour ${cuisineType || 'Cuisine Variée'} - ${new Date().toLocaleTimeString('fr-FR')}`, // Exemple de titre dynamique
        duration: `${Math.floor(Math.random() * (maxDuration - 20) + 20)} minutes`, // Durée aléatoire basée sur maxDuration
        
        // ATTENTION: Ces champs 'ingredients' et 'steps' DOIVENT être de type JSON dans Strapi Content-Type Builder
        ingredients: [
          { name: "Pomme de terre", quantity: "2 moyennes" },
          { name: "Carotte", quantity: "3" },
          { name: "Oignon", quantity: "1" },
          { name: "Pois chiches (en conserve)", quantity: "1 boîte (400g)" },
          { name: "Pâte de curry vert", quantity: "2 c. à soupe" },
          { name: "Lait de coco", quantity: "400 ml" },
          { name: "Riz Basmati", quantity: "200g" },
          { name: "Coriandre fraîche", quantity: "quelques brins" }
        ],
        steps: [
          "1. Préparer les légumes: Éplucher et couper les pommes de terre et carottes en dés. Hacher l'oignon.",
          "2. Faire revenir: Dans une cocotte, faire chauffer un filet d'huile. Ajouter l'oignon haché et faire revenir quelques minutes jusqu'à ce qu'il soit translucide.",
          "3. Ajouter les arômes: Incorporer la pâte de curry et faire cuire 1 minute en remuant constamment pour libérer les saveurs.",
          "4. Simmer: Ajouter les pommes de terre, les carottes, les pois chiches égouttés, et le lait de coco. Porter à ébullition, puis réduire le feu et laisser mijoter 20-25 minutes, jusqu'à ce que les légumes soient tendres.",
          "5. Servir: Pendant ce temps, cuire le riz Basmati. Servir le curry chaud, garni de coriandre fraîche.",
        ],
        
        cuisineType: cuisineType || "Asiatique", // Utilise la préférence ou une valeur par défaut
        numPeople: numPeople || 2, // Utilise la préférence ou une valeur par default
        maxDuration: maxDuration || 60, // Utilise la préférence ou une valeur par default
        difficulty: difficulty || "Facile", // Utilise la préférence ou une valeur par default
        robotCompatible: robotCompatible || false, // Utilise la préférence ou une valeur par default
        aiTested: true, // Marque la recette comme générée par l'IA
        source: "IA Générée", // Indique la source de la recette
        // NOUVEAU CHAMP POUR L'IMAGE
        imageUrl: "https://placehold.co/600x400/FF5733/FFFFFF?text=Recette+AI+Image" // URL d'image de substitution
      };

      try {
        // Enregistre la recette dans la base de données Strapi
        // ASSUREZ-VOUS que 'api::recipie.recipie' correspond à l'API ID de votre Collection Type
        // Si votre collection s'appelle 'Recipe' (singulier, avec 'e'), ce serait 'api::recipe.recipe'
        selectedRecipe = await strapi.entityService.create('api::recipie.recipie', { 
          data: mockRecipeData,
        });
        console.log("Recette AI mockée enregistrée dans la BD:", selectedRecipe);

      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la recette AI:", error);
        // Détaillez l'erreur si c'est une erreur de validation Strapi
        if (error.details && error.details.errors) {
            console.error("Détails de l'erreur Strapi:", error.details.errors);
            const validationErrors = error.details.errors.map(err => `${err.path}: ${err.message}`).join(', ');
            ctx.badRequest(`Erreur de validation Strapi: ${validationErrors}`);
        } else {
            ctx.badRequest('Erreur lors de la génération et de l\'enregistrement de la recette AI.');
        }
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
    // Vérifie si l'utilisateur est authentifié et s'il a le champ isAdmin défini à true
    if (!ctx.state.user || !ctx.state.user.isAdmin) {
      return ctx.unauthorized('Vous n\'avez pas les permissions nécessaires pour accéder aux statistiques.');
    }

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
    // Vérifie si l'utilisateur est authentifié et s'il a le champ isAdmin défini à true
    if (!ctx.state.user || !ctx.state.user.isAdmin) {
      return ctx.unauthorized('Vous n\'avez pas les permissions nécessaires pour accéder à la localisation des utilisateurs.');
    }

    // Données de localisation mockées
    const locations = [
      { lat: 48.8566, lon: 2.3522, city: 'Paris', country: 'France', users: 120 },
      { lat: 34.0522, lon: -118.2437, city: 'Los Angeles', country: 'USA', users: 80 },
      { lat: 51.5074, lon: -0.1278, city: 'London', country: 'UK', users: 95 },
      { lat: 35.6895, lon: 139.6917, city: 'Tokyo', country: 'Japan', users: 70 },
    ];

    return locations;
  },

  async getFeatureUsage(ctx) {
    // Vérifie si l'utilisateur est authentifié et s'il a le champ isAdmin défini à true
    if (!ctx.state.user || !ctx.state.user.isAdmin) {
      return ctx.unauthorized('Vous n\'avez pas les permissions nécessaires pour accéder à l\'utilisation des fonctionnalités.');
    }

    // Données d'utilisation des fonctionnalités mockées
    const usage = {
      generateRecipeAI: { percentage: 75, description: 'Utilisé régulièrement' },
      searchExistingRecipe: { percentage: 50, description: 'Utilisé souvent' },
      exploreInspirationalRecipes: { percentage: 60, description: 'Exploré' },
      viewMyRecipes: { percentage: 30, description: 'Consultent leurs recettes' },
      addToCart: { percentage: 40, description: 'Ajoutent au panier' },
      exportToRobot: { percentage: 15, description: 'Exportent pour robot' },
    };

    return usage;
  },
};
