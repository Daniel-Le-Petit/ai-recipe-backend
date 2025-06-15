const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      // Hôte de votre base de données sur Render.
      // Nous l'avons mis en dur ici pour le dépannage local,
      // mais en production, il est recommandé de le gérer via les variables d'environnement de Render.
      host: env('DATABASE_HOST', 'dpg-d13af43uibrs7380cfl0-a.frankfurt-postgres.render.com'),
      port: env.int('DATABASE_PORT', 5432), // Port par défaut de PostgreSQL sur Render
      // Le nom de votre base de données sur Render est aifb_a2h0
      database: env('DATABASE_NAME', 'aifb_a2h0'), 
      // Votre nom d'utilisateur pour la base de données sur Render (ex: 'aifb').
      // Assurez-vous que cette valeur correspond.
      user: env('DATABASE_USERNAME', 'aifb'), 
      // Votre mot de passe pour la base de données sur Render.
      // C'est CRUCIAL. Ne le mettez JAMAIS en dur directement dans ce fichier pour la production.
      // Pour le développement local, si vous n'utilisez pas de .env, vous pouvez le mettre ici
      // mais la meilleure pratique est d'utiliser les variables d'environnement.
      password: env('DATABASE_PASSWORD', 'YD73qk3D1tRwEwNGcn6L3hXyEHxex00a'), 
      ssl: env.bool('DATABASE_SSL', true), // Render PostgreSQL nécessite SSL
    },
    pool: {
      min: 0,
      max: 10,
    },
  },
});
