const API_URL = 'http://localhost:1338';

async function testFrontendAPI() {
  console.log('🧪 Test de l\'API frontend avec recipeState...\n');

  try {
    // 1. Test de récupération de toutes les recettes
    console.log('1️⃣ Récupération de toutes les recettes...');
    const allRecipesResponse = await fetch(`${API_URL}/api/recipies?populate=*`);
    
    if (!allRecipesResponse.ok) {
      throw new Error(`Erreur récupération: ${allRecipesResponse.status}`);
    }

    const allRecipes = await allRecipesResponse.json();
    console.log(`✅ ${allRecipes.data?.length || 0} recettes trouvées`);

    // Afficher les champs disponibles pour la première recette
    if (allRecipes.data && allRecipes.data.length > 0) {
      const firstRecipe = allRecipes.data[0];
      console.log('\n🔍 Champs disponibles dans la première recette:');
      console.log('Attributs:', Object.keys(firstRecipe.attributes));
      
      if (firstRecipe.attributes.recipeState) {
        console.log(`✅ recipeState: ${firstRecipe.attributes.recipeState}`);
      } else if (firstRecipe.attributes.status) {
        console.log(`⚠️ status (ancien): ${firstRecipe.attributes.status}`);
      } else {
        console.log('❌ Aucun champ de statut trouvé');
      }
    }

    // 2. Test de filtrage par recipeState
    console.log('\n2️⃣ Test de filtrage par recipeState...');
    const filterResponse = await fetch(`${API_URL}/api/recipies?filters[recipeState][$eq]=submitted&populate=*`);
    
    if (!filterResponse.ok) {
      throw new Error(`Erreur filtrage: ${filterResponse.status}`);
    }

    const filteredRecipes = await filterResponse.json();
    console.log(`✅ Recettes avec recipeState "submitted": ${filteredRecipes.data?.length || 0}`);

    // 3. Test de filtrage par status (ancien) pour voir si ça fonctionne encore
    console.log('\n3️⃣ Test de filtrage par status (ancien)...');
    const oldFilterResponse = await fetch(`${API_URL}/api/recipies?filters[status][$eq]=submitted&populate=*`);
    
    if (!oldFilterResponse.ok) {
      console.log(`❌ Filtrage par status échoue: ${oldFilterResponse.status}`);
    } else {
      const oldFilteredRecipes = await oldFilterResponse.json();
      console.log(`⚠️ Recettes avec status "submitted": ${oldFilteredRecipes.data?.length || 0}`);
    }

    // 4. Test de création d'une recette avec recipeState
    console.log('\n4️⃣ Test de création avec recipeState...');
    const createResponse = await fetch(`${API_URL}/api/recipies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          title: 'Test Frontend API',
          description: 'Test de l\'API frontend avec recipeState',
          recipeState: 'submitted'
        }
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error(`❌ Erreur création: ${createResponse.status} - ${errorText}`);
    } else {
      const createdRecipe = await createResponse.json();
      console.log(`✅ Recette créée avec ID: ${createdRecipe.data.id}`);
      console.log(`   recipeState: ${createdRecipe.data.attributes.recipeState}`);

      // Nettoyer - supprimer la recette de test
      const deleteResponse = await fetch(`${API_URL}/api/recipies/${createdRecipe.data.id}`, {
        method: 'DELETE'
      });
      
      if (deleteResponse.ok) {
        console.log('✅ Recette de test supprimée');
      }
    }

    console.log('\n🎉 Test de l\'API frontend terminé !');

  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testFrontendAPI(); 