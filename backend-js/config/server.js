// backend-js/config/server.js
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'), // '0.0.0.0' est important pour que Render puisse accéder à l'application
  port: env.int('PORT', 1338), // Lire le port depuis la variable d'environnement PORT (Render utilise souvent 10000)
  
  url: env('STRAPI_ADMIN_BACKEND_URL', 'http://localhost:1337'), // Lire l'URL publique depuis les variables d'environnement
  proxy: false, // Généralement false pour les services web hébergés
  app: {
    keys: env.array('APP_KEYS', ['defaultKey1', 'defaultKey2']), // Vos clés d'application
  },
  // ********************************************************************************
  // *** IMPORTANT : Définissez l'URL publique de votre backend Strapi !            ***
  // *** Ceci est crucial si Strapi doit générer des URLs publiques (ex: pour des assets) ***
  // *** ou pour certaines configurations de déploiement.                           ***
  // *** Par exemple : 'https://abcdef12345.loca.lt' ou 'https://votre-backend.onrender.com' ***
  // ********************************************************************************
  url: env('https://aifb-backend-dev.loca.lt', 'http://localhost:1338'), // REMPLACEZ CETTE LIGNE par votre URL publique
});