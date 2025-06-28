const axios = require('axios');

const API_URL = 'http://localhost:1338/api';

// Sample categories
const categories = [
  {
    categoryName: 'Plats principaux',
    categoryDescription: 'Recettes de plats principaux pour le déjeuner ou le dîner'
  },
  {
    categoryName: 'Entrées',
    categoryDescription: 'Entrées et apéritifs'
  },
  {
    categoryName: 'Desserts',
    categoryDescription: 'Desserts et pâtisseries'
  },
  {
    categoryName: 'Petit-déjeuner',
    categoryDescription: 'Recettes pour le petit-déjeuner'
  },
  {
    categoryName: 'Soupes',
    categoryDescription: 'Soupes et potages'
  }
];

// Sample recipes
const recipes = [
  {
    title: 'Poulet rôti aux herbes',
    description: 'Un délicieux poulet rôti avec des herbes fraîches et des légumes',
    duration: 60,
    difficulty: 'Facile',
    servings: 4,
    recipeState: 'saved',
    instructions: '1. Préchauffer le four à 180°C\n2. Assaisonner le poulet avec sel, poivre et herbes\n3. Placer dans un plat avec des légumes\n4. Cuire 45-50 minutes',
    ingredients: 'Poulet entier, herbes de Provence, huile d\'olive, sel, poivre, carottes, oignons',
    rating: 4.5,
    tags: ['poulet', 'herbes', 'rôti']
  },
  {
    title: 'Salade César',
    description: 'Une salade César classique avec une vinaigrette crémeuse',
    duration: 20,
    difficulty: 'Facile',
    servings: 2,
    recipeState: 'saved',
    instructions: '1. Laver et couper la laitue\n2. Préparer la vinaigrette\n3. Ajouter les croûtons et le parmesan\n4. Mélanger délicatement',
    ingredients: 'Laitue romaine, parmesan, croûtons, anchois, huile d\'olive, citron, ail',
    rating: 4.2,
    tags: ['salade', 'végétarien', 'rapide']
  },
  {
    title: 'Tiramisu classique',
    description: 'Le dessert italien par excellence avec café et mascarpone',
    duration: 30,
    difficulty: 'Intermédiaire',
    servings: 6,
    recipeState: 'saved',
    instructions: '1. Préparer le café fort\n2. Battre les jaunes avec le sucre\n3. Incorporer le mascarpone\n4. Monter les blancs en neige\n5. Alterner couches de biscuits et crème',
    ingredients: 'Mascarpone, œufs, sucre, café fort, biscuits à la cuillère, cacao',
    rating: 4.8,
    tags: ['dessert', 'italien', 'café']
  },
  {
    title: 'Omelette aux champignons',
    description: 'Une omelette moelleuse garnie de champignons sautés',
    duration: 15,
    difficulty: 'Facile',
    servings: 1,
    recipeState: 'saved',
    instructions: '1. Battre les œufs avec sel et poivre\n2. Sauter les champignons\n3. Verser les œufs dans la poêle\n4. Plier l\'omelette',
    ingredients: 'Œufs, champignons, beurre, sel, poivre, persil',
    rating: 4.0,
    tags: ['petit-déjeuner', 'rapide', 'végétarien']
  },
  {
    title: 'Soupe à l\'oignon gratinée',
    description: 'Une soupe traditionnelle française avec du fromage gratiné',
    duration: 90,
    difficulty: 'Intermédiaire',
    servings: 4,
    recipeState: 'saved',
    instructions: '1. Émincer les oignons finement\n2. Les faire caraméliser à feu doux\n3. Ajouter le bouillon et laisser mijoter\n4. Gratiner au four avec du fromage',
    ingredients: 'Oignons, bouillon de bœuf, beurre, pain, gruyère, vin blanc',
    rating: 4.6,
    tags: ['soupe', 'français', 'réconfortant']
  }
];

async function createCategories() {
  console.log('Creating categories...');
  const createdCategories = [];
  
  for (const category of categories) {
    try {
      const response = await axios.post(`${API_URL}/recipie-categories`, {
        data: category
      });
      createdCategories.push(response.data.data);
      console.log(`✅ Created category: ${category.categoryName}`);
    } catch (error) {
      console.error(`❌ Error creating category ${category.categoryName}:`, error.response?.data || error.message);
    }
  }
  
  return createdCategories;
}

async function createRecipes(categories) {
  console.log('Creating recipes...');
  
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const categoryIndex = i % categories.length;
    
    try {
      const recipeData = {
        ...recipe,
        recipieCategory: categories[categoryIndex].id
      };
      
      const response = await axios.post(`${API_URL}/recipies`, {
        data: recipeData
      });
      console.log(`✅ Created recipe: ${recipe.title}`);
    } catch (error) {
      console.error(`❌ Error creating recipe ${recipe.title}:`, error.response?.data || error.message);
    }
  }
}

async function populateDatabase() {
  try {
    console.log('🚀 Starting database population...');
    
    // Create categories first
    const createdCategories = await createCategories();
    
    if (createdCategories.length === 0) {
      console.log('❌ No categories were created. Stopping.');
      return;
    }
    
    // Create recipes with category associations
    await createRecipes(createdCategories);
    
    console.log('🎉 Database population completed!');
    console.log(`📊 Created ${createdCategories.length} categories and ${recipes.length} recipes`);
    
  } catch (error) {
    console.error('❌ Error populating database:', error.message);
  }
}

// Run the script
populateDatabase(); 