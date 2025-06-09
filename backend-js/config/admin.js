// module.exports = ({ env }) => ({
//   apiToken: {
//     salt: env('API_TOKEN_SALT', 'defaultSalt'),
//   },
//   auth: {
//     secret: env('ADMIN_JWT_SECRET', 'jevaisallapeche'),
//   },
// });


// C:\Users\AIFinesHerbes\AIFB\backend-js\config\admin.js

module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'defaultSecret'),
  },
});
