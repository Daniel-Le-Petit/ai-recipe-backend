'use strict';

/**
 * recipie service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::recipie.recipie', ({ strapi }) => ({
  // Service pour calculer la note moyenne d'une recette
  async calculateAverageRating(recipeId) {
    // Cette méthode pourrait être étendue pour calculer la moyenne des notes
    // si vous implémentez un système de notation multiple
    return 0;
  },

  // Service pour valider les ingrédients
  async validateIngredients(ingredients) {
    if (!Array.isArray(ingredients)) {
      throw new Error('Ingredients must be an array');
    }
    
    return ingredients.every(ingredient => 
      ingredient.name && 
      ingredient.quantity && 
      ingredient.unit
    );
  },

  // Service pour valider les instructions
  async validateInstructions(instructions) {
    if (!Array.isArray(instructions)) {
      throw new Error('Instructions must be an array');
    }
    
    return instructions.every((instruction, index) => 
      instruction.step && 
      instruction.order === index + 1
    );
  },

  // Service pour rechercher des recettes similaires
  async findSimilarRecipes(recipeId, limit = 5) {
    const recipe = await strapi.entityService.findOne('api::recipie.recipie', recipeId, {
      populate: ['recipieCategory', 'tags']
    });

    if (!recipe) {
      return [];
    }

    const filters = {
      $or: [
        {
          recipieCategory: recipe.recipieCategory?.id
        },
        {
          difficulty: recipe.difficulty
        }
      ],
      $not: {
        id: recipeId
      }
    };

    return await strapi.entityService.findMany('api::recipie.recipie', {
      filters,
      sort: { rating: 'desc' },
      limit,
      populate: {
        recipieCategory: true,
        author: {
          fields: ['id', 'username']
        },
        image: true
      }
    });
  },

  // Service pour obtenir les recettes populaires
  async getPopularRecipes(limit = 10) {
    return await strapi.entityService.findMany('api::recipie.recipie', {
      filters: {
        rating: {
          $gt: 0
        }
      },
      sort: { rating: 'desc' },
      limit,
      populate: {
        recipieCategory: true,
        author: {
          fields: ['id', 'username']
        },
        image: true
      }
    });
  },

  // Service pour obtenir les recettes récentes
  async getRecentRecipes(limit = 10) {
    return await strapi.entityService.findMany('api::recipie.recipie', {
      sort: { createdAt: 'desc' },
      limit,
      populate: {
        recipieCategory: true,
        author: {
          fields: ['id', 'username']
        },
        image: true
      }
    });
  },

  // Service pour rechercher des recettes par tags
  async searchByTags(tags, limit = 20) {
    const recipes = await strapi.entityService.findMany('api::recipie.recipie', {
      populate: {
        recipieCategory: true,
        author: {
          fields: ['id', 'username']
        },
        image: true
      }
    });

    return recipes.filter(recipe => {
      if (!recipe.tags || !Array.isArray(recipe.tags)) return false;
      return tags.some(tag => recipe.tags.includes(tag));
    }).slice(0, limit);
  },

  // Service pour obtenir les statistiques des recettes
  async getRecipeStats() {
    const recipes = await strapi.entityService.findMany('api::recipie.recipie', {
      fields: ['rating', 'difficulty', 'duration', 'isRobotCompatible']
    });

    const stats = {
      total: recipes.length,
      averageRating: 0,
      difficultyDistribution: {
        Facile: 0,
        Intermédiaire: 0,
        Difficile: 0
      },
      robotCompatible: 0,
      averageDuration: 0
    };

    if (recipes.length > 0) {
      const totalRating = recipes.reduce((sum, recipe) => sum + (recipe.rating || 0), 0);
      stats.averageRating = (totalRating / recipes.length).toFixed(1);

      const totalDuration = recipes.reduce((sum, recipe) => sum + (recipe.duration || 0), 0);
      stats.averageDuration = Math.round(totalDuration / recipes.length);

      recipes.forEach(recipe => {
        if (recipe.difficulty) {
          stats.difficultyDistribution[recipe.difficulty]++;
        }
        if (recipe.isRobotCompatible) {
          stats.robotCompatible++;
        }
      });
    }

    return stats;
  }
}));
