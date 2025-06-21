const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d13af43uibrs7380cfl0-a.frankfurt-postgres.render.com',
  port: 5432,
  database: 'aifb_a2h0',
  user: 'aifb',
  password: 'YD73qk3D1tRwEwNGcn6L3hXyEHxex00a',
  ssl: true
});

async function resetRecipiesTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Réinitialisation complète de la table recipies...');
    
    // 1. Vérifier si la table existe
    const existsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'recipies'
      )
    `;
    
    const existsResult = await client.query(existsQuery);
    
    if (existsResult.rows[0].exists) {
      console.log('📋 Table recipies trouvée, suppression en cours...');
      
      // 2. Supprimer la table
      const dropQuery = 'DROP TABLE recipies CASCADE';
      await client.query(dropQuery);
      console.log('✅ Table recipies supprimée');
      
    } else {
      console.log('📋 Table recipies n\'existe pas');
    }
    
    // 3. Vider aussi les tables de migrations
    console.log('\n🧹 Nettoyage des migrations...');
    
    const clearMigrationsQuery = 'DELETE FROM strapi_migrations_internal';
    const migrationsResult = await client.query(clearMigrationsQuery);
    console.log(`✅ ${migrationsResult.rowCount} migrations supprimées`);
    
    const clearSchemaQuery = 'DELETE FROM strapi_database_schema';
    const schemaResult = await client.query(clearSchemaQuery);
    console.log(`✅ ${schemaResult.rowCount} schémas supprimés`);
    
    // 4. Vérifier que la table n'existe plus
    const checkQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'recipies'
      )
    `;
    
    const checkResult = await client.query(checkQuery);
    
    if (!checkResult.rows[0].exists) {
      console.log('✅ Table recipies supprimée avec succès');
    } else {
      console.log('❌ La table recipies existe encore');
    }
    
    console.log('\n📝 Prochaines étapes:');
    console.log('   1. Redémarrer Strapi avec: npm run develop');
    console.log('   2. Strapi va recréer la table recipies proprement');
    console.log('   3. Plus de problème avec "Moyen"');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

resetRecipiesTable(); 