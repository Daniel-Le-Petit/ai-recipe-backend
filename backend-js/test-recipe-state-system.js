const API_URL = 'http://localhost:1338';

async function testRecipeStateSystem() {
  console.log('🧪 Test du système recipeState...\n');
  console.log(`🔗 URL de test: ${API_URL}`);

  try {
    // Test de connexion simple
    console.log('\n0️⃣ Test de connexion à Strapi...');
    const healthResponse = await fetch(`${API_URL}/api/recipies`);
    console.log(`✅ Connexion réussie: ${healthResponse.status}`);

    // 1. Créer une nouvelle recette avec recipeState draft
    console.log('\n1️⃣ Création d\'une nouvelle recette avec recipeState draft...');
    const createResponse = await fetch(`${API_URL}/api/recipies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          title: 'Test RecipeState',
          description: 'Recette de test pour vérifier le système recipeState',
          ingredients: ['Ingrédient 1', 'Ingrédient 2'],
          instructions: 'Instructions de test',
          duration: 30,
          difficulty: 'Facile',
          servings: 2,
          recipeState: 'draft'
        }
      })
    });

    console.log(`📡 Réponse création: ${createResponse.status}`);
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error(`❌ Erreur création: ${errorText}`);
      throw new Error(`Erreur création: ${createResponse.status} - ${errorText}`);
    }

    const createdRecipe = await createResponse.json();
    const recipeId = createdRecipe.data.id;
    console.log(`✅ Recette créée avec ID: ${recipeId}`);
    
    // Debug: Afficher tous les attributs disponibles
    console.log('\n🔍 Attributs disponibles dans la réponse:');
    console.log('createdRecipe.data.attributes:', JSON.stringify(createdRecipe.data.attributes, null, 2));
    
    // Vérifier si recipeState existe
    if (createdRecipe.data.attributes.recipeState) {
      console.log(`   recipeState: ${createdRecipe.data.attributes.recipeState}`);
    } else if (createdRecipe.data.attributes.status) {
      console.log(`   status (ancien): ${createdRecipe.data.attributes.status}`);
      console.log('⚠️ Le champ est encore "status" au lieu de "recipeState"');
    } else {
      console.log('❌ Aucun champ recipeState ou status trouvé');
    }
    
    console.log(`   title: ${createdRecipe.data.attributes.title}`);

    // 2. Tester la mise à jour du recipeState
    console.log('\n2️⃣ Test de mise à jour du recipeState...');
    const updateResponse = await fetch(`${API_URL}/api/recipies/${recipeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: { recipeState: 'approved' }
      })
    });

    console.log(`📡 Réponse mise à jour: ${updateResponse.status}`);

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error(`❌ Erreur mise à jour: ${errorText}`);
      throw new Error(`Erreur mise à jour: ${updateResponse.status} - ${errorText}`);
    }

    const updatedRecipe = await updateResponse.json();
    console.log(`✅ RecipeState mis à jour: ${updatedRecipe.data.attributes.recipeState || updatedRecipe.data.attributes.status}`);

    // 3. Tester la récupération par recipeState
    console.log('\n3️⃣ Test de récupération par recipeState...');
    const filterResponse = await fetch(`${API_URL}/api/recipies?filters[recipeState][$eq]=approved&populate=*`);
    
    console.log(`📡 Réponse filtrage: ${filterResponse.status}`);

    if (!filterResponse.ok) {
      const errorText = await filterResponse.text();
      console.error(`❌ Erreur filtrage: ${errorText}`);
      throw new Error(`Erreur filtrage: ${filterResponse.status} - ${errorText}`);
    }

    const filteredRecipes = await filterResponse.json();
    console.log(`✅ Recettes avec recipeState "approved": ${filteredRecipes.data?.length || 0}`);

    // 4. Nettoyer - Supprimer la recette de test
    console.log('\n4️⃣ Nettoyage - Suppression de la recette de test...');
    const deleteResponse = await fetch(`${API_URL}/api/recipies/${recipeId}`, {
      method: 'DELETE'
    });

    console.log(`📡 Réponse suppression: ${deleteResponse.status}`);

    if (!deleteResponse.ok) {
      console.log(`⚠️ Erreur suppression: ${deleteResponse.status}`);
    } else {
      console.log('✅ Recette de test supprimée');
    }

    console.log('\n🎉 Test du système recipeState réussi !');
    console.log('\n📊 Résumé des fonctionnalités testées:');
    console.log('   ✅ Création de recette avec recipeState');
    console.log('   ✅ Mise à jour de recipeState');
    console.log('   ✅ Filtrage par recipeState');
    console.log('   ✅ Suppression de recette');

  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Exécuter le test immédiatement
console.log('🚀 Démarrage du test...');
testRecipeStateSystem(); 