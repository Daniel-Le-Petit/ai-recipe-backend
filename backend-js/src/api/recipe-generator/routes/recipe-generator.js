// C:\Users\AIFinesHerbes\AIFB\backend-js\src\api\recipe-generator\routes\recipe-generator.js

'use strict';

/**
 * recipe-generator router
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/recipe-generator/generate',
      handler: 'recipe-generator.generate',
      config: {
        policies: [],
      },
    },
    // Nouvelle route pour les statistiques d'administration
    {
      method: 'GET',
      path: '/recipe-generator/admin-stats',
      handler: 'recipe-generator.getAdminStats',
      config: {
        policies: [], // Les vérifications de rôle sont faites dans le contrôleur pour l'exemple
      },
    },
    // Nouvelle route pour les localisations des utilisateurs
    {
      method: 'GET',
      path: '/recipe-generator/user-locations',
      handler: 'recipe-generator.getUserLocations',
      config: {
        policies: [],
      },
    },
    // Nouvelle route pour l'utilisation des fonctionnalités
    {
      method: 'GET',
      path: '/recipe-generator/feature-usage',
      handler: 'recipe-generator.getFeatureUsage',
      config: {
        policies: [],
      },
    },
  ],
};