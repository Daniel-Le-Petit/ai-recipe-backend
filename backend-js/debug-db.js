// debug-db.js
import pkg from 'pg';
const { Client } = pkg;

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // nécessaire si Render impose SSL sans CA custom
    },
  });

  try {
    await client.connect();
    console.log('✅ Connexion à la base réussie !');
  } catch (error) {
    console.error('❌ Erreur de connexion :', error.message);
  } finally {
    await client.end();
  }
}

testConnection();
