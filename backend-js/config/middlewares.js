"use client";

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
        'http://localhost:3000',          // Frontend Next.js en développement
        'https://ai-recipe-frontend-3vt7.onrender.com', // Votre frontend déployé sur Render
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