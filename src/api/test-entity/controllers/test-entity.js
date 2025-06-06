'use strict';

/**
 * test-entity controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::test-entity.test-entity');
