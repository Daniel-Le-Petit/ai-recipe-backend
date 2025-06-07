//module.exports = [
//  'strapi::errors',
//  'strapi::security',
//  {
//    name: 'strapi::cors',
//    config: {
//      origin: ['http://localhost:5173'],
//      headers: ['Content-Type', 'Authorization'],
//    },
//  },
//  'strapi::poweredBy',
//  'strapi::logger',
//  'strapi::query',
//  'strapi::body',
//  'strapi::session',
//   'strapi::favicon',
//   'strapi::public',
//];
// config/middlewares.js
module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:5173'],
      headers: '*', // <--- CHANGE THIS TO '*'
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'], // <--- It's also good practice to explicitly list all allowed methods, even if '*' is implied
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