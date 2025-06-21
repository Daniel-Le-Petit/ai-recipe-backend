const { Client } = require('pg');

async function clearAllData() {
  console.log('🗑️ Suppression de toutes les données existantes...');
  
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

    // Supprimer toutes les données
    await client.query('DELETE FROM recipies');
    console.log('✅ Toutes les recettes supprimées');

    await client.query('DELETE FROM recipie_categories');
    console.log('✅ Toutes les catégories supprimées');

    console.log('✅ Base de données vidée avec succès!');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Déconnecté de PostgreSQL');
  }
}

clearAllData(); 