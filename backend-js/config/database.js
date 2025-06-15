// backend-js/config/database.js

const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    // Le client par défaut est 'postgres', mais il sera surchargé si DATABASE_URL n'est pas définie.
    // Cela garantit que votre environnement de production utilise PostgreSQL.
    client: 'postgres', 
    connection: env('DATABASE_URL')
      ? {
          // Si DATABASE_URL est définie (ce qui sera le cas sur Render pour votre service de production),
          // utilisez PostgreSQL.
          client: 'pg', // Assurez-vous d'avoir 'pg' installé: npm install pg dans votre backend-js
          connectionString: env('DATABASE_URL', 'postgresql://localhost:5432/strapi'),
          ssl: { rejectUnauthorized: false }, // Nécessaire pour Render PostgreSQL
        }
      : {
          // Si DATABASE_URL n'est PAS définie (par exemple, pour votre nouveau service aifb-backend-dev),
          // utilisez SQLite pour l'environnement de développement.
          // Les données seront stockées dans un fichier '.tmp/data.db' à l'intérieur de l'application
          // et seront effacées à chaque redéploiement ou redémarrage du service sur Render.
          client: 'sqlite',
          connection: {
            filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
          },
          useNullAsDefault: true,
        },
    pool: {
      min: 0,
      max: 10,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
    },
  },
});
