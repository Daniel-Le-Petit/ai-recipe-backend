'use strict';

/**
 * recipie-category controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::recipie-category.recipie-category', ({ strapi }) => ({
  // Méthode pour récupérer les catégories avec leurs recettes
  async find(ctx) {
    const { query } = ctx;
    
    const entity = await strapi.entityService.findMany('api::recipie-category.recipie-category', {
      ...query,
      populate: {
        recipies: {
          fields: ['id', 'title', 'rating', 'difficulty'],
          populate: {
            image: true
          }
        },
        categoryImage: true
      }
    });
    
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode pour récupérer une catégorie par ID avec ses recettes
  async findOne(ctx) {
    const { id } = ctx.params;
    
    const entity = await strapi.entityService.findOne('api::recipie-category.recipie-category', id, {
      populate: {
        recipies: {
          populate: {
            author: {
              fields: ['id', 'username']
            },
            image: true
          }
        },
        categoryImage: true
      }
    });
    
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode pour créer une catégorie
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Générer automatiquement le slug si non fourni
    if (!data.categorySlug && data.categoryName) {
      data.categorySlug = data.categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const entity = await strapi.entityService.create('api::recipie-category.recipie-category', {
      data,
      populate: {
        recipies: true,
        categoryImage: true
      }
    });
    
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode pour mettre à jour une catégorie
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    
    // Générer automatiquement le slug si le nom change
    if (data.categoryName && !data.categorySlug) {
      data.categorySlug = data.categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const entity = await strapi.entityService.update('api::recipie-category.recipie-category', id, {
      data,
      populate: {
        recipies: true,
        categoryImage: true
      }
    });
    
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode pour récupérer une catégorie par slug
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    const entity = await strapi.entityService.findMany('api::recipie-category.recipie-category', {
      filters: {
        categorySlug: slug
      },
      populate: {
        recipies: {
          populate: {
            author: {
              fields: ['id', 'username']
            },
            image: true
          }
        },
        categoryImage: true
      }
    });
    
    if (entity.length === 0) {
      return ctx.notFound('Category not found');
    }
    
    const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode pour obtenir les statistiques d'une catégorie
  async getCategoryStats(ctx) {
    const { id } = ctx.params;
    
    const category = await strapi.entityService.findOne('api::recipie-category.recipie-category', id, {
      populate: {
        recipies: {
          fields: ['id', 'rating', 'difficulty', 'duration']
        }
      }
    });
    
    if (!category) {
      return ctx.notFound('Category not found');
    }
    
    const stats = {
      totalRecipes: category.recipies.length,
      averageRating: 0,
      difficultyDistribution: {
        Facile: 0,
        Intermédiaire: 0,
        Difficile: 0
      },
      averageDuration: 0
    };
    
    if (category.recipies.length > 0) {
      const totalRating = category.recipies.reduce((sum, recipe) => sum + (recipe.rating || 0), 0);
      stats.averageRating = (totalRating / category.recipies.length).toFixed(1);
      
      const totalDuration = category.recipies.reduce((sum, recipe) => sum + (recipe.duration || 0), 0);
      stats.averageDuration = Math.round(totalDuration / category.recipies.length);
      
      category.recipies.forEach(recipe => {
        if (recipe.difficulty) {
          stats.difficultyDistribution[recipe.difficulty]++;
        }
      });
    }
    
    return {
      data: {
        id: category.id,
        categoryName: category.categoryName,
        stats
      }
    };
  },

  // Méthode pour obtenir toutes les catégories avec statistiques
  async findAllWithStats(ctx) {
    const categories = await strapi.entityService.findMany('api::recipie-category.recipie-category', {
      populate: {
        recipies: {
          fields: ['id', 'rating', 'difficulty']
        },
        categoryImage: true
      }
    });
    
    const categoriesWithStats = categories.map(category => {
      const stats = {
        totalRecipes: category.recipies.length,
        averageRating: 0
      };
      
      if (category.recipies.length > 0) {
        const totalRating = category.recipies.reduce((sum, recipe) => sum + (recipe.rating || 0), 0);
        stats.averageRating = (totalRating / category.recipies.length).toFixed(1);
      }
      
      return {
        ...category,
        stats
      };
    });
    
    const sanitizedEntity = await this.sanitizeOutput(categoriesWithStats, ctx);
    return this.transformResponse(sanitizedEntity);
  }
}));
