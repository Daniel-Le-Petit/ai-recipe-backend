const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    database: process.env.DATABASE_NAME || 'aifinesherbes_test',
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'AliceNinon2025!',
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false,
    } : false,
  });

  try {
    console.log('🔌 Tentative de connexion à la base de données...');
    console.log('📊 Paramètres de connexion:');
    console.log(`   Host: ${process.env.DATABASE_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DATABASE_PORT || 5432}`);
    console.log(`   Database: ${process.env.DATABASE_NAME || 'aifinesherbes_test'}`);
    console.log(`   User: ${process.env.DATABASE_USERNAME || 'postgres'}`);
    console.log(`   SSL: ${process.env.NODE_ENV === 'production' ? 'Enabled' : 'Disabled'}`);
    
    await client.connect();
    console.log('✅ Connexion réussie !');
    
    const result = await client.query('SELECT NOW()');
    console.log('⏰ Heure du serveur:', result.rows[0].now);
    
    await client.end();
    console.log('🔌 Connexion fermée.');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.error('🔍 Détails:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Suggestion: Vérifiez que PostgreSQL est démarré et accessible');
    } else if (error.code === '28P01') {
      console.log('💡 Suggestion: Vérifiez le nom d\'utilisateur et le mot de passe');
    } else if (error.code === '3D000') {
      console.log('💡 Suggestion: Vérifiez que la base de données existe');
    }
  }
}

testConnection();
