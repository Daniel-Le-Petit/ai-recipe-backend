// backend-js/config/plugins.js

module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      // Correct : Utilise le NOM de la variable d'environnement
      // La valeur réelle du secret doit être définie via une variable d'environnement
      jwtSecret: env('JWT_SECRET_USERS_PERMISSIONS'), 
    },
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  // Ajoutez d'autres plugins ici si vous en avez
  // email: {
  //   config: {
  //     provider: 'sendmail',
  //     settings: {
  //       defaultFrom: 'myemail@example.com',
  //       defaultReplyTo: 'myemail@example.com',
  //     },
  //   },
  // },
});

