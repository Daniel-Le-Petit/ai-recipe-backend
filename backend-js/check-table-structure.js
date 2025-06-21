const { Client } = require('pg');

async function checkTableStructure() {
  console.log('🔍 Vérification de la structure de la table recipies...');
  
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

    // Vérifier la structure de la table
    console.log('📊 Structure de la table recipies:');
    const structureResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'recipies' 
      ORDER BY ordinal_position
    `);
    
    structureResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    // Vérifier les données existantes
    console.log('\n📊 Données existantes:');
    const dataResult = await client.query('SELECT * FROM recipies LIMIT 1');
    if (dataResult.rows.length > 0) {
      const sample = dataResult.rows[0];
      Object.keys(sample).forEach(key => {
        console.log(`  - ${key}: ${sample[key]} (type: ${typeof sample[key]})`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Déconnecté de PostgreSQL');
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  checkTableStructure();
}

module.exports = { checkTableStructure }; 