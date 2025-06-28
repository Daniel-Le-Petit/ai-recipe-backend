const knex = require('knex');

// Configuration de la base de données
const dbConfig = {
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'strapi'
  }
};

async function updateExistingRecipes() {
  const db = knex(dbConfig);
  
  try {
    console.log('🔄 Mise à jour des recettes existantes...');
    
    // Vérifier si la colonne recipe_state existe
    const hasRecipeStateColumn = await db.schema.hasColumn('recipies', 'recipe_state');
    if (!hasRecipeStateColumn) {
      console.log('❌ La colonne recipe_state n\'existe pas. Exécutez d\'abord la migration.');
      return;
    }

    // Compter les recettes sans recipe_state
    const recipesWithoutRecipeState = await db('recipies')
      .whereNull('recipe_state')
      .count('* as count');
    
    const count = recipesWithoutRecipeState[0].count;
    console.log(`📊 ${count} recette(s) sans recipe_state trouvée(s)`);

    if (count > 0) {
      // Mettre à jour toutes les recettes sans recipe_state avec 'approved' par défaut
      // (car ce sont probablement des recettes existantes qui étaient déjà "validées")
      const updated = await db('recipies')
        .whereNull('recipe_state')
        .update({ recipe_state: 'approved' });
      
      console.log(`✅ ${updated} recette(s) mise(s) à jour avec le recipe_state 'approved'`);
    } else {
      console.log('✅ Toutes les recettes ont déjà un recipe_state');
    }

    // Afficher un résumé des recipe_states
    const recipeStateSummary = await db('recipies')
      .select('recipe_state')
      .count('* as count')
      .groupBy('recipe_state');
    
    console.log('\n📋 Résumé des recipe_states :');
    recipeStateSummary.forEach(row => {
      console.log(`   ${row.recipe_state || 'null'}: ${row.count} recette(s)`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    await db.destroy();
  }
}

// Exécuter la mise à jour
updateExistingRecipes(); 