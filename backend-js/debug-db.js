import pkg from 'pg';
const { Client } = pkg;

// Config de connexion basique (modifie ici selon le test)
const configs = [
  {
    name: 'ssl: true',
    options: {
      user: 'aifb',
      host: 'dpg-d11ivqs9c44c73fctus0-a.frankfurt-postgres.render.com',
      database: 'aifb',
      password: '3hY10AHiJtmltVXRSQ3EKTJv0AC5bJQv',
      port: 5432,
      ssl: true,
      connectionTimeoutMillis: 10000,
    }
  },
  {
    name: 'ssl: { rejectUnauthorized: false }',
    options: {
      user: 'aifb',
      host: 'dpg-d11ivqs9c44c73fctus0-a.frankfurt-postgres.render.com',
      database: 'aifb',
      password: '3hY10AHiJtmltVXRSQ3EKTJv0AC5bJQv',
      port: 5432,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    }
  },
  {
    name: 'ssl: false (test sans SSL)',
    options: {
      user: 'aifb',
      host: 'dpg-d11ivqs9c44c73fctus0-a.frankfurt-postgres.render.com',
      database: 'aifb',
      password: '3hY10AHiJtmltVXRSQ3EKTJv0AC5bJQv',
      port: 5432,
      ssl: false,
      connectionTimeoutMillis: 10000,
    }
  }
];

(async () => {
  for (const config of configs) {
    console.log(`\n🔎 Test de connexion avec config: ${config.name}`);
    const client = new Client(config.options);

    try {
      await client.connect();
      console.log('✅ Connecté à la base !');
    } catch (err) {
      console.error('❌ Erreur de connexion :', err.message);
      // Afficher stack si besoin
      // console.error(err);
    } finally {
      await client.end();
    }
  }
})();
