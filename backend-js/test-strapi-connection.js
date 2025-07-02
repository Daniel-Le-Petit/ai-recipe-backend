// Script pour tester la connexion Strapi à PostgreSQL
const knex = require('knex');

// Configuration identique à celle de Strapi
const config = {
  client: 'postgres',
  connection: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    database: process.env.DATABASE_NAME || 'aifinesherbes',
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'AliceNinon2025!',
    ssl: process.env.DATABASE_SSL === 'true' || false,
  },
  pool: {
    min: 0,
    max: 10,
  },
};

console.log('🔍 Test de connexion Strapi à PostgreSQL...');
console.log('Configuration:');
console.log(`  Host: ${config.connection.host}`);
console.log(`  Port: ${config.connection.port}`);
console.log(`  Database: ${config.connection.database}`);
console.log(`  User: ${config.connection.user}`);
console.log(`  SSL: ${config.connection.ssl}`);

async function testConnection() {
  let db;
  
  try {
    console.log('\n📡 Test 1: Création de la connexion...');
    db = knex(config);
    
    console.log('📡 Test 2: Test de connexion...');
    await db.raw('SELECT 1');
    console.log('✅ Connexion réussie !');
    
    console.log('\n📊 Test 3: Vérification des tables...');
    const tables = await db.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%recipie%'
    `);
    console.log('✅ Tables trouvées:', tables.rows.map(row => row.table_name));
    
    console.log('\n📊 Test 4: Comptage des recettes...');
    const recipeCount = await db('recipies').count('* as count');
    console.log('✅ Nombre de recettes:', recipeCount[0].count);
    
    console.log('\n📊 Test 5: Comptage des catégories...');
    const categoryCount = await db('recipie_categories').count('* as count');
    console.log('✅ Nombre de catégories:', categoryCount[0].count);
    
    console.log('\n📊 Test 6: Récupération d\'une recette...');
    const recipe = await db('recipies').select('*').limit(1);
    if (recipe.length > 0) {
      console.log('✅ Recette trouvée:', recipe[0].title);
    } else {
      console.log('⚠️  Aucune recette trouvée');
    }
    
    console.log('\n🎯 Tous les tests passent ! Strapi devrait pouvoir se connecter.');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.error('   Détails:', error);
  } finally {
    if (db) {
      await db.destroy();
    }
  }
}

// Définir les variables d'environnement si elles ne sont pas définies
if (!process.env.DATABASE_PASSWORD) {
  process.env.DATABASE_PASSWORD = 'AliceNinon2025!';
}

testConnection(); 