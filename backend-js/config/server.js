// backend-js/config/server.js
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'), // '0.0.0.0' est important pour que Render puisse accéder à l'application
  port: env.int('PORT', 1337), // Lire le port depuis la variable d'environnement PORT (Render utilise souvent 10000)
  url: env('STRAPI_ADMIN_BACKEND_URL', 'http://localhost:1337'), // Lire l'URL publique depuis les variables d'environnement
  proxy: false, // Généralement false pour les services web hébergés
  app: {
    keys: env.array('APP_KEYS', ['defaultKey1', 'defaultKey2']), // Vos clés d'application
  },
  // Note: Le port 1338 que vous utilisez en local est pour votre machine seulement.
  // Sur Render, l'application doit écouter sur le port que Render lui assigne (souvent 10000)
  // et l'URL doit être l'URL publique de Render.
});