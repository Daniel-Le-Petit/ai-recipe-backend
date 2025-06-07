module.exports = ({ env }) => ({
  host: '0.0.0.0',
  port: 1338,
  url: 'http://localhost:1338',
  proxy: false,
  app: {
    keys: env.array('APP_KEYS', ['defaultKey1', 'defaultKey2']),
  },
});
