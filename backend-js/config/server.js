    module.exports = ({ env }) => ({
      host: env('HOST', '0.0.0.0'),
      port: env.int('PORT', 1338),
      app: {
        keys: env.array('APP_KEYS'),
      },
      // IMPORTANT: Pour le développement local, la 'url' doit correspondre à votre URL d'accès directe.
      // S'il y a un 'URL' ou 'ADMIN_URL' dans .env qui pointe vers localtunnel,
      // cela peut causer des problèmes en local. Pour ce test, assurez-vous qu'elle est correcte.
      url: env('PUBLIC_URL', 'http://localhost:1338'), // Assurez-vous que c'est HTTP pour localhost
      webhooks: {
        populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
      },
      // Si vous avez une section 'proxy', elle pourrait aussi causer des redirections.
      // Par défaut, en local, vous ne devriez pas en avoir.
      // proxy: {
      //   enabled: env.bool('PROXY_ENABLED', false),
      //   host: env('PROXY_HOST', 'localhost'),
      //   port: env.int('PROXY_PORT', 80),
      //   protocol: env('PROXY_PROTOCOL', 'http'),
      //   ssl: env.bool('PROXY_SSL', false),
      // },
    });
    
    