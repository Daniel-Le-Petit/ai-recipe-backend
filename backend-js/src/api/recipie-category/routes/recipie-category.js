'use strict';

/**
 * recipie-category router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::recipie-category.recipie-category');

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
          path: '/recipie-categories/slug/:slug',
          handler: 'recipie-category.findBySlug',
          config: {
            policies: [],
            middlewares: [],
          },
        },
        {
          method: 'GET',
          path: '/recipie-categories/:id/stats',
          handler: 'recipie-category.getCategoryStats',
          config: {
            policies: [],
            middlewares: [],
          },
        },
        {
          method: 'GET',
          path: '/recipie-categories/stats/all',
          handler: 'recipie-category.findAllWithStats',
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
