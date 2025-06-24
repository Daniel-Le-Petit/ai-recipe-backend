const axios = require('axios');

const API_BASE_URL = 'http://localhost:1338/api';

async function checkRecipes() {
  try {
    console.log('🔍 Vérification des recettes actuelles...\n');
    
    // Récupérer toutes les recettes
    const response = await axios.get(`${API_BASE_URL}/recipies?populate=*&sort=id:desc`);
    
    console.log(`📊 Nombre total de recettes: ${response.data.data.length}\n`);
    
    if (response.data.data.length === 0) {
      console.log('❌ Aucune recette trouvée dans la base de données');
      return;
    }
    
    console.log('📋 Liste des recettes (par ordre d\'ID décroissant):');
    console.log('─'.repeat(80));
    
    response.data.data.forEach((recipe, index) => {
      const id = recipe.id;
      const title = recipe.attributes?.title || 'Sans titre';
      const createdAt = recipe.attributes?.createdAt ? new Date(recipe.attributes.createdAt).toLocaleString('fr-FR') : 'Date inconnue';
      const status = recipe.attributes?.publishedAt ? '✅ Publiée' : '⏳ Brouillon';
      
      console.log(`${index + 1}. ID: ${id} | "${title}" | ${status} | Créée: ${createdAt}`);
    });
    
    console.log('\n🔍 Vérification spécifique de l\'ID 73...');
    
    try {
      const recipe73 = await axios.get(`${API_BASE_URL}/recipies/73?populate=*`);
      console.log('✅ La recette avec l\'ID 73 existe:');
      console.log(`   Titre: ${recipe73.data.data.attributes?.title || 'Sans titre'}`);
      console.log(`   Statut: ${recipe73.data.data.attributes?.publishedAt ? 'Publiée' : 'Brouillon'}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('❌ La recette avec l\'ID 73 n\'existe pas');
      } else {
        console.log('❌ Erreur lors de la vérification de l\'ID 73:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des recettes:', error.message);
    if (error.response) {
      console.error('   Détails:', error.response.data);
    }
  }
}

checkRecipes(); 