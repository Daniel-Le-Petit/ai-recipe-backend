const { Client } = require('pg');

async function fixPostgresData() {
  console.log('🔧 Correction des données PostgreSQL...');
  
  const client = new Client({
    host: 'dpg-d13af43uibrs7380cfl0-a.frankfurt-postgres.render.com',
    port: 5432,
    database: 'aifb_a2h0',
    user: 'aifb',
    password: 'YD73qk3D1tRwEwNGcn6L3hXyEHxex00a',
    ssl: true
  });

  try {
    await client.connect();
    console.log('✅ Connecté à PostgreSQL');

    // 1. Corriger les valeurs de difficulté
    console.log('🔄 Correction des valeurs de difficulté...');
    const difficultyResult = await client.query(`
      UPDATE recipies 
      SET difficulty = CASE 
        WHEN difficulty = 'Moyen' THEN 'Intermédiaire'
        WHEN difficulty = 'Facile' THEN 'Facile'
        WHEN difficulty = 'Difficile' THEN 'Difficile'
        ELSE 'Facile'
      END
      WHERE difficulty IS NOT NULL
    `);
    console.log(`✅ ${difficultyResult.rowCount} lignes de difficulté mises à jour`);

    // 2. Vérifier les données de difficulté
    console.log('📊 Vérification des difficultés...');
    const difficultyCheck = await client.query('SELECT DISTINCT difficulty FROM recipies');
    console.log('📋 Difficultés trouvées:');
    difficultyCheck.rows.forEach(row => {
      console.log(`  - "${row.difficulty}"`);
    });

    // 3. Vérifier les durées
    console.log('📊 Vérification des durées...');
    const durationCheck = await client.query('SELECT id, duration FROM recipies LIMIT 5');
    console.log('📋 Durées trouvées:');
    durationCheck.rows.forEach(row => {
      console.log(`  ID ${row.id}: ${row.duration} minutes`);
    });

    // 4. Vérifier les autres champs
    console.log('📊 Vérification des autres champs...');
    const otherCheck = await client.query(`
      SELECT 
        COUNT(*) as total_recipes,
        COUNT(CASE WHEN title IS NOT NULL THEN 1 END) as with_title,
        COUNT(CASE WHEN description IS NOT NULL THEN 1 END) as with_description,
        COUNT(CASE WHEN ingredients IS NOT NULL THEN 1 END) as with_ingredients
      FROM recipies
    `);
    
    const stats = otherCheck.rows[0];
    console.log('📋 Statistiques:');
    console.log(`  - Total recettes: ${stats.total_recipes}`);
    console.log(`  - Avec titre: ${stats.with_title}`);
    console.log(`  - Avec description: ${stats.with_description}`);
    console.log(`  - Avec ingrédients: ${stats.with_ingredients}`);

    console.log('✅ Toutes les données ont été corrigées!');

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error.message);
    
    if (error.code) {
      console.error(`Code d'erreur: ${error.code}`);
    }
    if (error.detail) {
      console.error(`Détail: ${error.detail}`);
    }
    
  } finally {
    await client.end();
    console.log('🔌 Déconnecté de PostgreSQL');
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  fixPostgresData();
}

 