const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Diagnostic de la base de données PostgreSQL');
console.log('=============================================');

// Configuration de la base de données
const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  database: process.env.DATABASE_NAME || 'strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

console.log('📋 Configuration de la base de données:');
console.log(`   Host: ${dbConfig.host}`);
console.log(`   Port: ${dbConfig.port}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   SSL: ${dbConfig.ssl ? 'Activé' : 'Désactivé'}`);

async function testDatabaseConnection() {
  const pool = new Pool(dbConfig);
  
  try {
    console.log('\n🔌 Test de connexion à PostgreSQL...');
    
    // Test de connexion basique
    const client = await pool.connect();
    console.log('✅ Connexion PostgreSQL réussie !');
    
    // Test de requête simple
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Requête test réussie !');
    console.log(`   Heure serveur: ${result.rows[0].current_time}`);
    console.log(`   Version PostgreSQL: ${result.rows[0].pg_version.split(' ')[0]}`);
    
    // Vérifier les tables Strapi
    console.log('\n📊 Vérification des tables Strapi...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%recipie%'
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log('✅ Tables Strapi trouvées:');
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      
      // Compter les recettes
      const countResult = await client.query('SELECT COUNT(*) as count FROM recipies');
      console.log(`   Nombre de recettes: ${countResult.rows[0].count}`);
    } else {
      console.log('⚠️  Aucune table Strapi trouvée');
    }
    
    // Vérifier les permissions
    console.log('\n🔐 Vérification des permissions...');
    const permissionsResult = await client.query(`
      SELECT has_table_privilege($1, 'recipies', 'SELECT') as can_select,
             has_table_privilege($1, 'recipies', 'INSERT') as can_insert,
             has_table_privilege($1, 'recipies', 'UPDATE') as can_update,
             has_table_privilege($1, 'recipies', 'DELETE') as can_delete
    `, [dbConfig.user]);
    
    console.log('   Permissions sur la table recipies:');
    console.log(`   - SELECT: ${permissionsResult.rows[0].can_select ? '✅' : '❌'}`);
    console.log(`   - INSERT: ${permissionsResult.rows[0].can_insert ? '✅' : '❌'}`);
    console.log(`   - UPDATE: ${permissionsResult.rows[0].can_update ? '✅' : '❌'}`);
    console.log(`   - DELETE: ${permissionsResult.rows[0].can_delete ? '✅' : '❌'}`);
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:');
    console.error(`   ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n🔧 Solutions possibles:');
      console.error('   1. PostgreSQL n\'est pas démarré');
      console.error('   2. Le port PostgreSQL est incorrect');
      console.error('   3. Le firewall bloque la connexion');
    } else if (error.code === '28P01') {
      console.error('\n🔧 Solutions possibles:');
      console.error('   1. Identifiants incorrects');
      console.error('   2. Utilisateur PostgreSQL inexistant');
    } else if (error.code === '3D000') {
      console.error('\n🔧 Solutions possibles:');
      console.error('   1. Base de données inexistante');
      console.error('   2. Nom de base de données incorrect');
    }
  } finally {
    await pool.end();
  }
}

async function testStrapiAPI() {
  console.log('\n🌐 Test de l\'API Strapi...');
  
  try {
    const response = await fetch('http://localhost:1338/api/recipie?populate=*');
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ API Strapi accessible - ${data.data?.length || 0} recettes`);
    } else {
      console.log('   ❌ API Strapi retourne une erreur');
    }
  } catch (error) {
    console.error('   ❌ Erreur API Strapi:', error.message);
    console.error('\n🔧 Solutions possibles:');
    console.error('   1. Strapi n\'est pas démarré');
    console.error('   2. Problème de connexion à la base de données');
    console.error('   3. Variables d\'environnement incorrectes');
  }
}

async function runDiagnostic() {
  await testDatabaseConnection();
  await testStrapiAPI();
  
  console.log('\n📋 Résumé du diagnostic:');
  console.log('========================');
  console.log('1. Vérifiez que PostgreSQL est démarré');
  console.log('2. Vérifiez les variables d\'environnement DATABASE_*');
  console.log('3. Vérifiez que Strapi peut se connecter à la base');
  console.log('4. Redémarrez Strapi si nécessaire');
}

runDiagnostic();
