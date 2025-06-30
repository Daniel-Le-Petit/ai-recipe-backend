const axios = require('axios');

const BASE_URL = 'http://localhost:1338/api';

// Configuration axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
};

// Variables globales pour stocker les IDs créés
let categoryId, recipeId;

// Tests pour les catégories
async function testCategories() {
  log.info('🧪 Test des catégories...');
  
  try {
    // 1. Créer une catégorie
    log.info('Création d\'une catégorie...');
    const createCategoryResponse = await api.post('/recipie-categories', {
      data: {
        categoryName: 'Pâtes Italiennes',
        categoryDescription: 'Recettes de pâtes traditionnelles italiennes',
        categorySlug: 'pates-italiennes'
      }
    });
    
    categoryId = createCategoryResponse.data.data.id;
    log.success(`Catégorie créée avec l'ID: ${categoryId}`);
    
    // 2. Récupérer toutes les catégories
    log.info('Récupération de toutes les catégories...');
    const categoriesResponse = await api.get('/recipie-categories');
    log.success(`Nombre de catégories: ${categoriesResponse.data.data.length}`);
    
    // 3. Récupérer une catégorie par ID
    log.info('Récupération d\'une catégorie par ID...');
    const categoryResponse = await api.get(`/recipie-categories/${categoryId}`);
    log.success(`Catégorie trouvée: ${categoryResponse.data.data.attributes.categoryName}`);
    
    // 4. Récupérer une catégorie par slug
    log.info('Récupération d\'une catégorie par slug...');
    const categoryBySlugResponse = await api.get('/recipie-categories/slug/pates-italiennes');
    log.success(`Catégorie trouvée par slug: ${categoryBySlugResponse.data.data.attributes.categoryName}`);
    
    // 5. Obtenir les statistiques d'une catégorie
    log.info('Récupération des statistiques de catégorie...');
    const statsResponse = await api.get(`/recipie-categories/${categoryId}/stats`);
    log.success(`Statistiques récupérées: ${statsResponse.data.data.stats.totalRecipes} recettes`);
    
    // 6. Obtenir toutes les statistiques
    log.info('Récupération de toutes les statistiques...');
    const allStatsResponse = await api.get('/recipie-categories/stats/all');
    log.success(`Statistiques globales récupérées`);
    
  } catch (error) {
    log.error(`Erreur lors du test des catégories: ${error.message}`);
  }
}

// Tests pour les recettes
async function testRecipes() {
  log.info('🧪 Test des recettes...');
  
  try {
    // 1. Créer une recette
    log.info('Création d\'une recette...');
    const createRecipeResponse = await api.post('/recipies', {
      data: {
        title: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta with eggs, cheese and pancetta',
        ingredients: [
          { name: 'Spaghetti', quantity: 400, unit: 'g' },
          { name: 'Oeufs', quantity: 4, unit: 'unités' },
          { name: 'Parmesan', quantity: 100, unit: 'g' },
          { name: 'Pancetta', quantity: 150, unit: 'g' },
          { name: 'Poivre noir', quantity: 1, unit: 'cuillère à café' }
        ],
        instructions: '1. Cuire les pâtes dans l\'eau salée\n2. Faire revenir la pancetta\n3. Mélanger les oeufs avec le parmesan\n4. Combiner tous les ingrédients',
        duration: 25,
        difficulty: 'Intermédiaire',
        servings: 4,
        recipieCategory: categoryId,
        isRobotCompatible: true,
        tags: ['italien', 'pâtes', 'rapide', 'traditionnel']
      }
    });
    
    recipeId = createRecipeResponse.data.data.id;
    log.success(`Recette créée avec l'ID: ${recipeId}`);
    
    // 2. Récupérer toutes les recettes
    log.info('Récupération de toutes les recettes...');
    const recipesResponse = await api.get('/recipies');
    log.success(`Nombre de recettes: ${recipesResponse.data.data.length}`);
    
    // 3. Récupérer une recette par ID
    log.info('Récupération d\'une recette par ID...');
    const recipeResponse = await api.get(`/recipies/${recipeId}`);
    log.success(`Recette trouvée: ${recipeResponse.data.data.attributes.title}`);
    
    // 4. Rechercher par catégorie
    log.info('Recherche de recettes par catégorie...');
    const recipesByCategoryResponse = await api.get(`/recipies/category/${categoryId}`);
    log.success(`Recettes trouvées dans la catégorie: ${recipesByCategoryResponse.data.data.length}`);
    
    // 5. Rechercher par difficulté
    log.info('Recherche de recettes par difficulté...');
    const recipesByDifficultyResponse = await api.get('/recipies/difficulty/Intermédiaire');
    log.success(`Recettes trouvées par difficulté: ${recipesByDifficultyResponse.data.data.length}`);
    
    // 6. Rechercher les recettes compatibles robot
    log.info('Recherche de recettes compatibles robot...');
    const robotCompatibleResponse = await api.get('/recipies/robot-compatible');
    log.success(`Recettes compatibles robot: ${robotCompatibleResponse.data.data.length}`);
    
    // 7. Noter une recette
    log.info('Notation d\'une recette...');
    const ratingResponse = await api.post(`/recipies/${recipeId}/rate`, {
      rating: 4.5
    });
    log.success(`Recette notée: ${ratingResponse.data.data.attributes.rating} étoiles`);
    
    // 8. Mettre à jour une recette
    log.info('Mise à jour d\'une recette...');
    const updateResponse = await api.put(`/recipies/${recipeId}`, {
      data: {
        title: 'Spaghetti Carbonara - Version Améliorée',
        description: 'Classic Italian pasta with eggs, cheese and pancetta - Enhanced version'
      }
    });
    log.success(`Recette mise à jour: ${updateResponse.data.data.attributes.title}`);
    
  } catch (error) {
    log.error(`Erreur lors du test des recettes: ${error.message}`);
  }
}

// Tests de validation
async function testValidation() {
  log.info('🧪 Test de validation...');
  
  try {
    // 1. Test de création de recette sans titre (doit échouer)
    log.info('Test de validation - recette sans titre...');
    try {
      await api.post('/recipies', {
        data: {
          description: 'Recette sans titre'
        }
      });
      log.error('La validation a échoué - une recette sans titre a été créée');
    } catch (error) {
      log.success('Validation réussie - impossible de créer une recette sans titre');
    }
    
    // 2. Test de création de catégorie sans nom (doit échouer)
    log.info('Test de validation - catégorie sans nom...');
    try {
      await api.post('/recipie-categories', {
        data: {
          categoryDescription: 'Catégorie sans nom'
        }
      });
      log.error('La validation a échoué - une catégorie sans nom a été créée');
    } catch (error) {
      log.success('Validation réussie - impossible de créer une catégorie sans nom');
    }
    
    // 3. Test de notation invalide (doit échouer)
    log.info('Test de validation - notation invalide...');
    try {
      await api.post(`/recipies/${recipeId}/rate`, {
        rating: 6.0
      });
      log.error('La validation a échoué - une note invalide a été acceptée');
    } catch (error) {
      log.success('Validation réussie - impossible de noter avec une valeur invalide');
    }
    
  } catch (error) {
    log.error(`Erreur lors du test de validation: ${error.message}`);
  }
}

// Nettoyage des données de test
async function cleanup() {
  log.info('🧹 Nettoyage des données de test...');
  
  try {
    if (recipeId) {
      await api.delete(`/recipies/${recipeId}`);
      log.success('Recette de test supprimée');
    }
    
    if (categoryId) {
      await api.delete(`/recipie-categories/${categoryId}`);
      log.success('Catégorie de test supprimée');
    }
  } catch (error) {
    log.error(`Erreur lors du nettoyage: ${error.message}`);
  }
}

// Fonction principale
async function runTests() {
  log.info('🚀 Démarrage des tests de l\'API...');
  
  try {
    await testCategories();
    await testRecipes();
    await testValidation();
    
    log.success('🎉 Tous les tests sont terminés avec succès!');
    
    // Optionnel: nettoyer les données de test
    // await cleanup();
    
  } catch (error) {
    log.error(`Erreur lors de l'exécution des tests: ${error.message}`);
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  testCategories,
  testRecipes,
  testValidation,
  cleanup
}; 