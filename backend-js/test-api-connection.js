const axios = require('axios');

const API_BASE_URL = 'http://localhost:1338/api';

async function testConnection() {
  try {
    console.log('🔍 Test de connexion à Strapi...');
    console.log(`URL: ${API_BASE_URL}/recipies`);
    
    const response = await axios.get(`${API_BASE_URL}/recipies?populate=*&sort=id:desc&pagination[pageSize]=5`, {
      timeout: 5000 // Timeout de 5 secondes
    });
    
    console.log('✅ Connexion réussie !');
    console.log(`📊 Nombre de recettes: ${response.data.data.length}`);
    
    if (response.data.data.length > 0) {
      console.log('📋 Dernière recette:');
      const lastRecipe = response.data.data[0];
      console.log(`   ID: ${lastRecipe.id}`);
      console.log(`   Titre: ${lastRecipe.attributes?.title || 'Sans titre'}`);
      console.log(`   Statut: ${lastRecipe.attributes?.publishedAt ? 'Publié' : 'Brouillon'}`);
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion:');
    if (error.code === 'ECONNREFUSED') {
      console.error('   Strapi n\'est pas démarré ou pas accessible sur le port 1338');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   Timeout - Strapi met trop de temps à répondre');
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

testConnection(); 