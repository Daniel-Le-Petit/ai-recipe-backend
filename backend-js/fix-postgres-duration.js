const { Client } = require('pg');

async function fixPostgresDuration() {
  console.log('🔧 Correction de la colonne duration dans PostgreSQL...');
  
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

    // Vérifier les données existantes
    console.log('📊 Vérification des données existantes...');
    const checkResult = await client.query('SELECT id, duration FROM recipies LIMIT 5');
    console.log('📋 Exemples de données:');
    checkResult.rows.forEach(row => {
      console.log(`  ID ${row.id}: duration = "${row.duration}" (type: ${typeof row.duration})`);
    });

    // Solution 1: Mettre à jour les données existantes
    console.log('🔄 Mise à jour des données existantes...');
    const updateResult = await client.query(`
      UPDATE recipies 
      SET duration = CASE 
        WHEN duration ~ '^[0-9]+' THEN CAST(REGEXP_REPLACE(duration, '[^0-9]', '', 'g') AS INTEGER)
        ELSE NULL 
      END
      WHERE duration IS NOT NULL
    `);
    console.log(`✅ ${updateResult.rowCount} lignes mises à jour`);

    // Vérifier le résultat
    console.log('📊 Vérification après mise à jour...');
    const verifyResult = await client.query('SELECT id, duration FROM recipies LIMIT 5');
    console.log('📋 Données après correction:');
    verifyResult.rows.forEach(row => {
      console.log(`  ID ${row.id}: duration = ${row.duration} (type: ${typeof row.duration})`);
    });

    console.log('✅ Colonne duration corrigée avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error.message);
    
    // Afficher plus de détails sur l'erreur
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
  fixPostgresDuration();
}

module.exports = { fixPostgresDuration }; 