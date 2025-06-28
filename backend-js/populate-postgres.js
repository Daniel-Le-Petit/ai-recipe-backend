const axios = require('axios');

const API_URL = 'http://localhost:1338';

// Fonction pour créer une catégorie
async function createCategory(categoryData) {
  try {
    const response = await axios.post(`${API_URL}/api/recipie-categories`, {
      data: categoryData
    });
    console.log(`✅ Catégorie créée: ${categoryData.categoryName}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('duplicate')) {
      console.log(`⚠️ Catégorie déjà existante: ${categoryData.categoryName}`);
      return null;
    }
    console.error(`❌ Erreur création catégorie ${categoryData.categoryName}:`, error.response?.data || error.message);
    return null;
  }
}

// Fonction pour créer une recette
async function createRecipe(recipeData) {
  try {
    const response = await axios.post(`${API_URL}/api/recipies`, {
      data: recipeData
    });
    console.log(`✅ Recette créée: ${recipeData.title}`);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Erreur création recette ${recipeData.title}:`, error.response?.data || error.message);
    return null;
  }
}

// Données de test
const categories = [
  {
    categoryName: 'Entrées',
    categoryDescription: 'Délicieuses entrées pour commencer le repas',
    categorySlug: 'entrees'
  },
  {
    categoryName: 'Plats principaux',
    categoryDescription: 'Plats complets et équilibrés',
    categorySlug: 'plats-principaux'
  },
  {
    categoryName: 'Desserts',
    categoryDescription: 'Douceurs et pâtisseries',
    categorySlug: 'desserts'
  },
  {
    categoryName: 'Boissons',
    categoryDescription: 'Rafraîchissements et cocktails',
    categorySlug: 'boissons'
  }
];

const recipes = [
  {
    title: "Soupe à l'oignon gratinée",
    description: "Une soupe traditionnelle française avec du fromage gratiné",
    ingredients: [
      { name: "Oignons", quantity: 4, unit: "pièces" },
      { name: "Beurre", quantity: 50, unit: "g" },
      { name: "Fromage râpé", quantity: 100, unit: "g" },
      { name: "Pain", quantity: 4, unit: "tranches" }
    ],
    instructions: "1. Émincer les oignons\n2. Les faire revenir dans le beurre\n3. Ajouter de l'eau et laisser mijoter\n4. Gratiner au four avec le fromage",
    duration: 45,
    difficulty: "Facile",
    servings: 4,
    rating: 4.5,
    tags: ["soupe", "gratin", "traditionnel"],
    isRobotCompatible: true,
    recipeState: "approved",
    recipieCategory: 1
  },
  {
    title: "Poulet rôti aux herbes",
    description: "Poulet rôti avec des herbes de Provence",
    ingredients: [
      { name: "Poulet", quantity: 1, unit: "pièce" },
      { name: "Herbes de Provence", quantity: 2, unit: "cuillères à soupe" },
      { name: "Huile d'olive", quantity: 3, unit: "cuillères à soupe" },
      { name: "Sel", quantity: 1, unit: "cuillère à café" }
    ],
    instructions: "1. Préchauffer le four à 180°C\n2. Badigeonner le poulet d'huile\n3. Saler et herber\n4. Enfourner 1h30",
    duration: 90,
    difficulty: "Intermédiaire",
    servings: 6,
    rating: 4.8,
    tags: ["poulet", "rôti", "herbes"],
    isRobotCompatible: false,
    recipeState: "approved",
    recipieCategory: 2
  },
  {
    title: "Tarte au citron meringuée",
    description: "Tarte acidulée avec une meringue légère",
    ingredients: [
      { name: "Pâte sablée", quantity: 1, unit: "pièce" },
      { name: "Citrons", quantity: 4, unit: "pièces" },
      { name: "Œufs", quantity: 4, unit: "pièces" },
      { name: "Sucre", quantity: 200, unit: "g" }
    ],
    instructions: "1. Préparer la pâte sablée\n2. Faire la crème au citron\n3. Monter la meringue\n4. Assembler et dorer",
    duration: 120,
    difficulty: "Difficile",
    servings: 8,
    rating: 4.9,
    tags: ["dessert", "citron", "meringue"],
    isRobotCompatible: true,
    recipeState: "approved",
    recipieCategory: 3
  },
  {
    title: "Smoothie vert énergisant",
    description: "Smoothie healthy aux épinards et fruits",
    ingredients: [
      { name: "Épinards", quantity: 100, unit: "g" },
      { name: "Banane", quantity: 1, unit: "pièce" },
      { name: "Pomme", quantity: 1, unit: "pièce" },
      { name: "Lait d'amande", quantity: 200, unit: "ml" }
    ],
    instructions: "1. Laver les épinards\n2. Éplucher et couper les fruits\n3. Mixer tous les ingrédients\n4. Servir frais",
    duration: 10,
    difficulty: "Facile",
    servings: 2,
    rating: 4.2,
    tags: ["smoothie", "healthy", "vert"],
    isRobotCompatible: true,
    recipeState: "approved",
    recipieCategory: 4
  },
  {
    title: "Salade César",
    description: "Salade classique avec croûtons et parmesan",
    ingredients: [
      { name: "Laitue romaine", quantity: 1, unit: "pièce" },
      { name: "Croûtons", quantity: 100, unit: "g" },
      { name: "Parmesan", quantity: 50, unit: "g" },
      { name: "Sauce César", quantity: 4, unit: "cuillères à soupe" }
    ],
    instructions: "1. Laver et couper la laitue\n2. Ajouter les croûtons\n3. Râper le parmesan\n4. Arroser de sauce",
    duration: 15,
    difficulty: "Facile",
    servings: 4,
    rating: 4.3,
    tags: ["salade", "césar", "légumes"],
    isRobotCompatible: true,
    recipeState: "approved",
    recipieCategory: 1
  }
];

// Fonction principale
async function populateDatabase() {
  console.log('🚀 Début du peuplement de la base de données PostgreSQL...\n');

  // Créer les catégories
  console.log('📂 Création des catégories...');
  const createdCategories = [];
  for (const category of categories) {
    const createdCategory = await createCategory(category);
    if (createdCategory) {
      createdCategories.push(createdCategory);
    }
  }

  // Attendre un peu pour s'assurer que les catégories sont créées
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Créer les recettes
  console.log('\n🍽️ Création des recettes...');
  for (const recipe of recipes) {
    await createRecipe(recipe);
  }

  console.log('\n✅ Peuplement terminé !');
  console.log(`📊 ${createdCategories.length} catégories créées`);
  console.log(`🍽️ ${recipes.length} recettes créées`);
}

// Exécuter le script
populateDatabase().catch(console.error); 