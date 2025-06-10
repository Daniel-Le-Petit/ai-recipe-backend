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

    // --- Liste de recettes du domaine public (exemples) ---
    // Ces recettes peuvent être stockées dans une collection Strapi à l'avenir.
    const publicDomainRecipes = [
      {
        id: 1,
        title: "Salade Composée Fraîcheur (Végétarien, Facile)",
        duration: "15 minutes",
        ingredients: [
          { name: "Laitue", quantity: "1 tête" },
          { name: "Tomates cerises", quantity: "250g" },
          { name: "Concombre", quantity: "1" },
          { name: "Feta", quantity: "100g" },
          { name: "Olives noires", quantity: "50g" },
          { name: "Huile d'olive", quantity: "2 c. à soupe" },
          { name: "Vinaigre balsamique", quantity: "1 c. à soupe" },
          { name: "Sel, poivre", quantity: "au goût" },
        ],
        steps: [
          "Laver et couper la laitue, les tomates et le concombre.",
          "Émietter la feta et couper les olives en rondelles.",
          "Mélanger tous les ingrédients dans un grand saladier.",
          "Préparer la vinaigrette avec l'huile, le vinaigre, le sel et le poivre. Verser sur la salade et servir frais."
        ],
        cuisineType: "Méditerranéenne",
        numPeople: 2,
        maxDuration: 20,
        difficulty: "Facile",
        robotCompatible: false,
        source: "Domaine Public"
      },
      {
        id: 2,
        title: "Pâtes au Pesto et Poulet Grillé (Facile)",
        duration: "25 minutes",
        ingredients: [
          { name: "Pâtes (type penne)", quantity: "200g" },
          { name: "Blanc de poulet", quantity: "200g" },
          { name: "Pesto", quantity: "4 c. à soupe" },
          { name: "Tomates séchées", quantity: "50g" },
          { name: "Parmesan râpé", quantity: "2 c. à soupe" },
          { name: "Huile d'olive", quantity: "1 c. à soupe" },
          { name: "Sel, poivre", quantity: "au goût" },
        ],
        steps: [
          "Faire cuire les pâtes selon les instructions du paquet.",
          "Pendant ce temps, couper le poulet en dés et le faire griller à la poêle avec un filet d'huile d'olive jusqu'à ce qu'il soit doré.",
          "Égoutter les pâtes. Dans un grand saladier, mélanger les pâtes chaudes avec le pesto, le poulet grillé et les tomates séchées coupées en morceaux.",
          "Servir chaud, saupoudré de parmesan râpé."
        ],
        cuisineType: "Italienne",
        numPeople: 2,
        maxDuration: 30,
        difficulty: "Facile",
        robotCompatible: false,
        source: "Domaine Public"
      },
      {
        id: 3,
        title: "Curry Végétarien aux Lentilles Corail (Moyen, Rapide)",
        duration: "35 minutes",
        ingredients: [
          { name: "Lentilles corail", quantity: "150g" },
          { name: "Lait de coco", quantity: "400ml" },
          { name: "Oignon", quantity: "1" },
          { name: "Gousses d'ail", quantity: "2" },
          { name: "Gingembre frais", quantity: "1 morceau (2cm)" },
          { name: "Pâte de curry rouge", quantity: "1 c. à soupe" },
          { name: "Épinards frais", quantity: "200g" },
          { name: "Huile végétale", quantity: "1 c. à soupe" },
          { name: "Riz Basmati", quantity: "150g" }
        ],
        steps: [
          "Rincer les lentilles corail. Hacher l'oignon, l'ail et le gingembre.",
          "Dans une casserole, faire chauffer l'huile. Faire revenir l'oignon, l'ail et le gingembre hachés pendant 2 minutes.",
          "Ajouter la pâte de curry et cuire 1 minute en remuant.",
          "Ajouter les lentilles corail, le lait de coco et 200ml d'eau. Porter à ébullition, puis réduire le feu et laisser mijoter 15-20 minutes, jusqu'à ce que les lentilles soient tendres.",
          "Ajouter les épinards en fin de cuisson et remuer jusqu'à ce qu'ils soient flétris.",
          "Pendant ce temps, cuire le riz Basmati selon les instructions du paquet. Servir le curry avec le riz."
        ],
        cuisineType: "Asiatique",
        numPeople: 3,
        maxDuration: 40,
        difficulty: "Moyen",
        robotCompatible: false,
        source: "Domaine Public"
      },
      {
        id: 4,
        title: "Omelette aux Fines Herbes (Simple)",
        duration: "10 minutes",
        ingredients: [
          { name: "Oeufs", quantity: "3" },
          { name: "Lait", quantity: "1 c. à soupe" },
          { name: "Fines herbes (persil, ciboulette)", quantity: "1 c. à café hachées" },
          { name: "Beurre", quantity: "1 noix" },
          { name: "Sel, poivre", quantity: "au goût" },
        ],
        steps: [
          "Casser les œufs dans un bol, ajouter le lait, le sel, le poivre et les fines herbes. Battre énergiquement.",
          "Faire fondre le beurre dans une poêle à feu moyen.",
          "Verser le mélange d'œufs dans la poêle chaude. Laisser prendre les bords, puis ramener la partie cuite vers le centre.",
          "Quand l'omelette est baveuse ou cuite à votre goût, plier en deux et servir immédiatement."
        ],
        cuisineType: "Française",
        numPeople: 1,
        maxDuration: 15,
        difficulty: "Facile",
        robotCompatible: false,
        source: "Domaine Public"
      }
      // Vous pouvez ajouter d'autres recettes ici
    ];

    let selectedRecipe = null;

    if (actionType === 'searchExisting') {
      // --- LOGIQUE DE RECHERCHE DE RECETTES EXISTANTES PAR INGRÉDIENTS ---
      if (ingredients && ingredients.length > 0) {
        const requestedIngredientsLower = ingredients.map(i => i.toLowerCase());
        
        // Recherche une recette qui contient au moins UN des ingrédients demandés
        selectedRecipe = publicDomainRecipes.find(recipe => 
          recipe.ingredients.some(recipeIng => 
            requestedIngredientsLower.some(reqIng => recipeIng.name.toLowerCase().includes(reqIng))
          )
        );

        // Si aucune correspondance directe par ingrédient, peut fallback sur la cuisine ou difficulté si spécifié
        if (!selectedRecipe) {
          if (cuisineType && publicDomainRecipes.find(r => r.cuisineType.toLowerCase() === cuisineType.toLowerCase())) {
            selectedRecipe = publicDomainRecipes.find(r => r.cuisineType.toLowerCase() === cuisineType.toLowerCase());
          } else if (difficulty && publicDomainRecipes.find(r => r.difficulty.toLowerCase() === difficulty.toLowerCase())) {
            selectedRecipe = publicDomainRecipes.find(r => r.difficulty.toLowerCase() === difficulty.toLowerCase());
          }
        }

      } else {
        // Si aucun ingrédient n'est fourni pour la recherche, renvoyer une erreur ou une recette aléatoire
        ctx.badRequest('Veuillez fournir des ingrédients pour la recherche.');
        return;
      }
    } else { // actionType est 'generateAI' ou non spécifié (comportement par défaut)
      // --- LOGIQUE DE GÉNÉRATION IA (MOCKÉE POUR L'INSTANT) ---
      // Renvoie une recette aléatoire parmi les exemples de domaine public pour simuler la génération IA
      selectedRecipe = publicDomainRecipes[Math.floor(Math.random() * publicDomainRecipes.length)];
    }

    if (selectedRecipe) {
      // Simuler l'ajout de propriétés comme 'aiTested' et 'robotCompatible'
      // Ces valeurs devraient idéalement être dans la base de données Strapi pour chaque recette
      selectedRecipe.aiTested = true; // Simule que ces recettes "pré-générées" sont validées
      selectedRecipe.robotCompatible = Math.random() > 0.5; // Simule la compatibilité robot
      
      return { recipe: selectedRecipe };
    } else {
      // Si aucune recette n'est trouvée (même pas les exemples), renvoyer une erreur
      ctx.badRequest('Aucune recette trouvée correspondant à vos critères.');
      return;
    }
  },
};
