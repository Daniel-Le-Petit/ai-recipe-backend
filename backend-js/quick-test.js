const axios = require('axios');

async function quickTest() {
  console.log('🧪 Test rapide de l\'API...');
  
  try {
    // Test de connexion à l'API
    const response = await axios.get('http://localhost:1337/api/recipies', {
      timeout: 5000
    });
    
    console.log('✅ API accessible!');
    console.log(`📊 ${response.data.data.length} recettes trouvées`);
    
    // Afficher quelques recettes
    response.data.data.slice(0, 3).forEach(recipe => {
      console.log(`  - ${recipe.attributes.title} (${recipe.attributes.duration} min)`);
    });
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Strapi n\'est pas encore démarré ou accessible');
      console.log('💡 Attendez quelques secondes et réessayez');
    } else {
      console.log('❌ Erreur API:', error.message);
    }
  }
}

// Attendre un peu puis tester
setTimeout(quickTest, 3000); 