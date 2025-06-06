'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/recipe-generator/generate',
      handler: 'recipe-generator.generate',
      config: {
        policies: [],
        middlewares: [],
        auth: false, // Laissez à 'false' pour le moment pour les tests
      },
    },
  ],
};