'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::recipe-generator.recipe-generator');