const { Client } = require('pg');

async function forceFixAll() {
  console.log('🔧 Correction forcée de toutes les données...');
  
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

    // 1. Vérifier toutes les difficultés
    console.log('📊 Vérification des difficultés...');
    const difficultyCheck = await client.query('SELECT id, difficulty FROM recipies');
    console.log('📋 Toutes les difficultés:');
    difficultyCheck.rows.forEach(row => {
      console.log(`  ID ${row.id}: "${row.difficulty}"`);
    });

    // 2. Forcer la correction de toutes les difficultés
    console.log('🔄 Correction forcée des difficultés...');
    const updateResult = await client.query(`
      UPDATE recipies
      SET difficulty = 'Facile'
      WHERE difficulty != 'Facile' OR difficulty IS NULL
    `);
    console.log(`✅ ${updateResult.rowCount} lignes mises à jour`);

    // 3. Vérifier le résultat
    console.log('📊 Vérification après correction...');
    const finalCheck = await client.query('SELECT DISTINCT difficulty FROM recipies');
    console.log('📋 Difficultés finales:');
    finalCheck.rows.forEach(row => {
      console.log(`  - "${row.difficulty}"`);
    });

    // 4. Vérifier qu'il n'y a plus de "Moyen"
    const moyenCheck = await client.query("SELECT COUNT(*) as count FROM recipies WHERE difficulty = 'Moyen'");
    console.log(`📊 Nombre de recettes avec 'Moyen': ${moyenCheck.rows[0].count}`);

    console.log('✅ Correction forcée terminée!');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Déconnecté de PostgreSQL');
  }
}

forceFixAll(); 