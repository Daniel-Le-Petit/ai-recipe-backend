const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: 'postgres', // Or 'sqlite' etc., based on your client
    connection: env('DATABASE_URL'), // Use the DATABASE_URL directly
    useNullAsDefault: true, // Common for SQLite, but might be needed for others
    ssl: env.bool('DATABASE_SSL', false) && {
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
    },
    pool: {
      min: 0,
      max: 10,
    },
    debug: false,
  },
});