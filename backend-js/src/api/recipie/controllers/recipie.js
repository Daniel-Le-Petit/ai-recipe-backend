'use strict';

/**
 * recipie controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::recipie.recipie', ({ strapi }) => ({
  // Méthode pour récupérer les recettes avec leurs relations
  async find(ctx) {
    const { query } = ctx;
    
    // Inclure les relations par défaut
    const entity = await strapi.entityService.findMany('api::recipie.recipie', {
      ...query,
      populate: {
        recipieCategory: true,
        author: {
          fields: ['id', 'username', 'email']
        },
        image: true
      }
    });
    
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode pour récupérer une recette par ID avec relations
  async findOne(ctx) {
    const { id } = ctx.params;
    
    const entity = await strapi.entityService.findOne('api::recipie.recipie', id, {
      populate: {
        recipieCategory: true,
        author: {
          fields: ['id', 'username', 'email']
        },
        image: true
      }
    });
    
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode pour créer une recette
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Ajouter l'auteur automatiquement si non spécifié
    if (!data.author && ctx.state.user) {
      data.author = ctx.state.user.id;
    }
    
    const entity = await strapi.entityService.create('api::recipie.recipie', {
      data,
      populate: {
        recipieCategory: true,
        author: true,
        image: true
      }
    });
    
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode pour mettre à jour une recette
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    
    const entity = await strapi.entityService.update('api::recipie.recipie', id, {
      data,
      populate: {
        recipieCategory: true,
        author: true,
        image: true
      }
    });
    
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode pour rechercher des recettes par catégorie
  async findByCategory(ctx) {
    const { categoryId } = ctx.params;
    
    const entity = await strapi.entityService.findMany('api::recipie.recipie', {
      filters: {
        recipieCategory: categoryId
      },
      populate: {
        recipieCategory: true,
        author: {
          fields: ['id', 'username']
        },
        image: true
      }
    });
    
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode pour rechercher des recettes par difficulté
  async findByDifficulty(ctx) {
    const { difficulty } = ctx.params;
    
    const entity = await strapi.entityService.findMany('api::recipie.recipie', {
      filters: {
        difficulty: difficulty
      },
      populate: {
        recipieCategory: true,
        author: {
          fields: ['id', 'username']
        },
        image: true
      }
    });
    
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode pour rechercher des recettes compatibles robot
  async findRobotCompatible(ctx) {
    const entity = await strapi.entityService.findMany('api::recipie.recipie', {
      filters: {
        isRobotCompatible: true
      },
      populate: {
        recipieCategory: true,
        author: {
          fields: ['id', 'username']
        },
        image: true
      }
    });
    
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode pour noter une recette
  async rateRecipe(ctx) {
    const { id } = ctx.params;
    const { rating } = ctx.request.body;
    
    if (rating < 0 || rating > 5) {
      return ctx.badRequest('Rating must be between 0 and 5');
    }
    
    const entity = await strapi.entityService.update('api::recipie.recipie', id, {
      data: { rating },
      populate: {
        recipieCategory: true,
        author: true,
        image: true
      }
    });
    
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  }
}));
