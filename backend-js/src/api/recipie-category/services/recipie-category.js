'use strict';

/**
 * recipie-category service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::recipie-category.recipie-category', ({ strapi }) => ({
  // Service pour générer un slug unique
  async generateUniqueSlug(name) {
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    let counter = 1;
    let uniqueSlug = slug;
    
    while (true) {
      const existing = await strapi.entityService.findMany('api::recipie-category.recipie-category', {
        filters: { categorySlug: uniqueSlug }
      });
      
      if (existing.length === 0) {
        break;
      }
      
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    
    return uniqueSlug;
  },

  // Service pour valider le nom de catégorie
  async validateCategoryName(name) {
    if (!name || name.trim().length === 0) {
      throw new Error('Category name is required');
    }
    
    if (name.length > 100) {
      throw new Error('Category name must be less than 100 characters');
    }
    
    // Vérifier si le nom existe déjà
    const existing = await strapi.entityService.findMany('api::recipie-category.recipie-category', {
      filters: { categoryName: name }
    });
    
    if (existing.length > 0) {
      throw new Error('Category name already exists');
    }
    
    return true;
  },

  // Service pour obtenir les catégories avec le nombre de recettes
  async getCategoriesWithRecipeCount() {
    const categories = await strapi.entityService.findMany('api::recipie-category.recipie-category', {
      populate: {
        recipies: {
          fields: ['id']
        },
        categoryImage: true
      }
    });
    
    return categories.map(category => ({
      ...category,
      recipeCount: category.recipies?.length || 0
    }));
  },

  // Service pour obtenir les catégories populaires
  async getPopularCategories(limit = 5) {
    const categories = await strapi.entityService.findMany('api::recipie-category.recipie-category', {
      populate: {
        recipies: {
          fields: ['id', 'rating'],
          filters: {
            rating: {
              $gt: 0
            }
          }
        },
        categoryImage: true
      }
    });
    
    const categoriesWithAvgRating = categories.map(category => {
      const recipes = category.recipies || [];
      const totalRating = recipes.reduce((sum, recipe) => sum + (recipe.rating || 0), 0);
      const averageRating = recipes.length > 0 ? (totalRating / recipes.length).toFixed(1) : 0;
      
      return {
        ...category,
        recipeCount: recipes.length,
        averageRating: parseFloat(averageRating)
      };
    });
    
    return categoriesWithAvgRating
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);
  },

  // Service pour rechercher des catégories par nom
  async searchCategories(searchTerm, limit = 10) {
    return await strapi.entityService.findMany('api::recipie-category.recipie-category', {
      filters: {
        $or: [
          {
            categoryName: {
              $containsi: searchTerm
            }
          },
          {
            categoryDescription: {
              $containsi: searchTerm
            }
          }
        ]
      },
      limit,
      populate: {
        recipies: {
          fields: ['id']
        },
        categoryImage: true
      }
    });
  },

  // Service pour obtenir les statistiques globales des catégories
  async getGlobalCategoryStats() {
    const categories = await strapi.entityService.findMany('api::recipie-category.recipie-category', {
      populate: {
        recipies: {
          fields: ['id', 'rating', 'difficulty', 'duration']
        }
      }
    });
    
    const stats = {
      totalCategories: categories.length,
      totalRecipes: 0,
      averageRecipesPerCategory: 0,
      mostPopularCategory: null,
      categoryWithHighestRating: null
    };
    
    let totalRecipes = 0;
    let maxRecipes = 0;
    let maxRating = 0;
    
    categories.forEach(category => {
      const recipeCount = category.recipies?.length || 0;
      totalRecipes += recipeCount;
      
      if (recipeCount > maxRecipes) {
        maxRecipes = recipeCount;
        stats.mostPopularCategory = {
          id: category.id,
          name: category.categoryName,
          recipeCount
        };
      }
      
      if (recipeCount > 0) {
        const totalRating = category.recipies.reduce((sum, recipe) => sum + (recipe.rating || 0), 0);
        const averageRating = totalRating / recipeCount;
        
        if (averageRating > maxRating) {
          maxRating = averageRating;
          stats.categoryWithHighestRating = {
            id: category.id,
            name: category.categoryName,
            averageRating: averageRating.toFixed(1)
          };
        }
      }
    });
    
    stats.totalRecipes = totalRecipes;
    stats.averageRecipesPerCategory = categories.length > 0 ? (totalRecipes / categories.length).toFixed(1) : 0;
    
    return stats;
  }
}));
