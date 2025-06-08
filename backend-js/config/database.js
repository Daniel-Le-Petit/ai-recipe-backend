// backend-js/config/database.js
const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      // Ces valeurs par défaut sont pour votre environnement LOCAL (si non définies via ENV vars)
      // Elles devraient correspondre à votre configuration PostgreSQL locale.
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'aifinesherbes'), // <<< Assurez-vous que c'est le nom de votre DB locale
      user: env('DATABASE_USERNAME', 'postgres'),     // <<< Assurez-vous que c'est le user de votre DB locale
      password: env('DATABASE_PASSWORD', 'AliceNinon2025!'), // <<< Assurez-vous que c'est le mot de passe de votre DB locale
      
      // >>>>>>> SECTION SSL CRUCIALE POUR RENDER <<<<<<<
      ssl: env.bool('DATABASE_SSL', false) ? {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
        // Cette option 'extra' est cruciale pour la compatibilité SSL avec Render
        extra: {
          ssl: true, 
        }, 
      } : false, 
    },
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2), // Valeur recommandée pour Strapi
      max: env.int('DATABASE_POOL_MAX', 10),
    },
  },
});