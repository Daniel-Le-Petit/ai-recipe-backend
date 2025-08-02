'use strict';

/**
 * weekly-plan service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::weekly-plan.weekly-plan');
