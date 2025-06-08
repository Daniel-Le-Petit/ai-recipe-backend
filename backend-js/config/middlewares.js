// backend-js/config/middlewares.js
module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:5173',          // L'URL de votre frontend local
        'http://localhost:1338',          // L'URL de votre backend local (pour le tableau de bord Strapi et les éventuels appels depuis l'API)
        'https://aifb-backend.onrender.com', // L'URL de votre backend déployé sur Render (utile si votre frontend déployé l'appelle)
        // Ajoutez ici l'URL de votre frontend s'il est déployé (ex: 'https://votre-frontend.onrender.com')
        // Si vous testez avec Postman/Insomnia, cela n'a pas d'impact car ils contournent CORS
      ],
      // Méthodes HTTP autorisées
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      // En-têtes autorisés (très important pour Content-Type et Authorization)
      headers: ['Content-Type', 'Authorization', 'Accept'],
      // Si vous utilisez des cookies ou des sessions entre domaines, mettez à true
      // credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];