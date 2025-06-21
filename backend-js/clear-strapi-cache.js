const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d13af43uibrs7380cfl0-a.frankfurt-postgres.render.com',
  port: 5432,
  database: 'aifb_a2h0',
  user: 'aifb',
  password: 'YD73qk3D1tRwEwNGcn6L3hXyEHxex00a',
  ssl: true
});

async function clearStrapiCache() {
  const client = await pool.connect();
  
  try {
    console.log('🧹 Nettoyage du cache et des migrations Strapi...');
    
    // 1. Vider la table des migrations internes
    console.log('\n1️⃣ Vider strapi_migrations_internal...');
    const clearMigrationsQuery = 'DELETE FROM strapi_migrations_internal';
    const migrationsResult = await client.query(clearMigrationsQuery);
    console.log(`   ✅ ${migrationsResult.rowCount} migrations supprimées`);
    
    // 2. Vider la table du schéma de base de données
    console.log('\n2️⃣ Vider strapi_database_schema...');
    const clearSchemaQuery = 'DELETE FROM strapi_database_schema';
    const schemaResult = await client.query(clearSchemaQuery);
    console.log(`   ✅ ${schemaResult.rowCount} schémas supprimés`);
    
    // 3. Vider les versions d'historique
    console.log('\n3️⃣ Vider strapi_history_versions...');
    const clearHistoryQuery = 'DELETE FROM strapi_history_versions';
    const historyResult = await client.query(clearHistoryQuery);
    console.log(`   ✅ ${historyResult.rowCount} versions d'historique supprimées`);
    
    // 4. Vider les paramètres du store core
    console.log('\n4️⃣ Vider strapi_core_store_settings...');
    const clearSettingsQuery = 'DELETE FROM strapi_core_store_settings';
    const settingsResult = await client.query(clearSettingsQuery);
    console.log(`   ✅ ${settingsResult.rowCount} paramètres supprimés`);
    
    // 5. Vérifier que les tables sont vides
    console.log('\n5️⃣ Vérification que les tables sont vides...');
    const tables = [
      'strapi_migrations_internal',
      'strapi_database_schema', 
      'strapi_history_versions',
      'strapi_core_store_settings'
    ];
    
    for (const table of tables) {
      const countQuery = `SELECT COUNT(*) as count FROM "${table}"`;
      const countResult = await client.query(countQuery);
      const count = parseInt(countResult.rows[0].count);
      console.log(`   ${table}: ${count} lignes`);
    }
    
    console.log('\n✅ Nettoyage terminé!');
    console.log('\n📝 Prochaines étapes:');
    console.log('   1. Redémarrer Strapi avec: npm run develop');
    console.log('   2. Strapi va recréer les migrations et le schéma');
    console.log('   3. Les valeurs "Moyen" ne devraient plus poser problème');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

clearStrapiCache(); 