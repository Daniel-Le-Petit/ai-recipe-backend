'use strict';

/**
 * recipie router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::recipie.recipie');

// Fonction pour ajouter des routes personnalisées
const customRoutes = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat([
        {
          method: 'GET',
          path: '/recipies/category/:categoryId',
          handler: 'recipie.findByCategory',
          config: {
            policies: [],
            middlewares: [],
          },
        },
        {
          method: 'GET',
          path: '/recipies/difficulty/:difficulty',
          handler: 'recipie.findByDifficulty',
          config: {
            policies: [],
            middlewares: [],
          },
        },
        {
          method: 'GET',
          path: '/recipies/robot-compatible',
          handler: 'recipie.findRobotCompatible',
          config: {
            policies: [],
            middlewares: [],
          },
        },
        {
          method: 'POST',
          path: '/recipies/:id/rate',
          handler: 'recipie.rateRecipe',
          config: {
            policies: [],
            middlewares: [],
          },
        },
      ]);
      return routes;
    },
  };
};

module.exports = customRoutes(defaultRouter);
