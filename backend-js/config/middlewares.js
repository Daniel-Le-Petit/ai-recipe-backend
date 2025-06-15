module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      // URLs autorisées à faire des requêtes vers votre backend Strapi
      origin: [
        'http://localhost:5173',          // Votre frontend React en développement
        'https://aifb-frontend.onrender.com', // Votre frontend déployé sur Render
        'https://aifb-frontend-dev.loca.lt', // Si vous utilisez localtunnel pour le frontend
      ],
      // Méthodes HTTP que vous autorisez
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      // Headers autorisés (gardez ceux par défaut et ajoutez si nécessaire)
      headers: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
      // Permettre l'envoi de credentials (cookies, en-têtes d'autorisation)
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];