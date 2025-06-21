const { Client } = require('pg');

async function checkAllTables() {
  console.log('🔍 Vérification de toutes les tables...');
  
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

    // Lister toutes les tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📊 Tables trouvées:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Vérifier les données dans chaque table
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      const countResult = await client.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      const count = countResult.rows[0].count;
      console.log(`  📋 ${tableName}: ${count} lignes`);
      
      if (count > 0 && tableName.includes('recipie')) {
        const sampleResult = await client.query(`SELECT * FROM "${tableName}" LIMIT 1`);
        console.log(`    Exemple:`, sampleResult.rows[0]);
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Déconnecté de PostgreSQL');
  }
}

checkAllTables(); 