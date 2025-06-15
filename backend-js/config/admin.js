// module.exports = ({ env }) => ({
//   auth: {
//     secret: env('ADMIN_JWT_SECRET'),
//   },
//   apiToken: {
//     salt: env('API_TOKEN_SALT'),
//   },
//   transfer: {
//     token: {
//       salt: env('TRANSFER_TOKEN_SALT'),
//     },
//   },
  // Pour le développement local, l'admin doit pointer vers l'URL locale de Strapi
//   url: env('STRAPI_ADMIN_BACKEND_URL', 'http://localhost:1338'), // Définit l'URL pour l'admin
// });

module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  // ... autres configurations
  url: env('STRAPI_ADMIN_URL', '/admin'), // Ou 'http://localhost:1338'
});