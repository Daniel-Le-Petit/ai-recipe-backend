'use strict';

/**
 * test-entity service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::test-entity.test-entity');
