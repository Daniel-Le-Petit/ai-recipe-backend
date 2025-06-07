'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/chatgpt',
      handler: 'chatgpt.generate',
      config: {
        auth: false,
      },
    },
  ],
};
