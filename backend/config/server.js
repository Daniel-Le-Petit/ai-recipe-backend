module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // https: { ... }  // à enlever ou désactiver si tu ne veux pas HTTPS
});