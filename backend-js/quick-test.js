const axios = require('axios');

const API_BASE_URL = 'http://localhost:1338/api';

async function quickTest() {
  console.log('🔍 Test rapide de Strapi et base de données');
  console.log('==========================================');
  
  try {
    // Test 1: Vérifier si Strapi répond
    console.log('\n1️⃣ Test de réponse Strapi...');
    const response = await axios.get(`${API_BASE_URL}/recipie?populate=*`, {
      timeout: 5000
    });
    
    console.log('✅ Strapi répond correctement');
    console.log(`📊 Nombre de recettes: ${response.data.data?.length || 0}`);
    
    // Test 2: Vérifier la structure des données
    if (response.data.data && response.data.data.length > 0) {
      const recipe = response.data.data[0];
      console.log('\n2️⃣ Structure des données:');
      console.log(`   ID: ${recipe.id}`);
      console.log(`   Titre: ${recipe.attributes?.title || 'Sans titre'}`);
      console.log(`   Statut: ${recipe.attributes?.recipeState || 'Non défini'}`);
      console.log(`   Créé le: ${recipe.attributes?.createdAt || 'Non défini'}`);
    }
    
    // Test 3: Vérifier les catégories
    console.log('\n3️⃣ Test des catégories...');
    const categoriesResponse = await axios.get(`${API_BASE_URL}/recipie-categories?populate=*`);
    console.log(`✅ Catégories: ${categoriesResponse.data.data?.length || 0} trouvées`);
    
    console.log('\n🎉 Tous les tests sont passés !');
    console.log('✅ Strapi fonctionne correctement');
    console.log('✅ Base de données accessible');
    console.log('✅ API opérationnelle');
    
  } catch (error) {
    console.error('\n❌ Erreur détectée:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   Strapi n\'est pas démarré ou pas accessible sur le port 1338');
      console.error('\n🔧 Solutions:');
      console.error('   1. Démarrez Strapi: npm run develop');
      console.error('   2. Vérifiez que le port 1338 est libre');
      console.error('   3. Vérifiez les logs Strapi pour les erreurs de DB');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   Timeout - Strapi met trop de temps à répondre');
      console.error('\n🔧 Solutions:');
      console.error('   1. Vérifiez la connexion à la base de données');
      console.error('   2. Redémarrez Strapi');
      console.error('   3. Vérifiez les variables d\'environnement');
    } else if (error.response) {
      console.error(`   Erreur HTTP: ${error.response.status} ${error.response.statusText}`);
      console.error('\n🔧 Solutions:');
      console.error('   1. Vérifiez que la base de données est accessible');
      console.error('   2. Vérifiez les migrations Strapi');
      console.error('   3. Redémarrez Strapi');
    } else {
      console.error(`   Erreur: ${error.message}`);
    }
  }
}

quickTest(); 