const path = require('path');

module.exports = ({ env }) => {
  // Use PostgreSQL for both development and production
  const databaseClient = env('DATABASE_CLIENT', 'postgres');
  
  if (databaseClient === 'sqlite') {
    // SQLite configuration (if explicitly requested)
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
        },
        useNullAsDefault: true,
      },
    };
  }
  
  // PostgreSQL configuration (default)
  const connection = {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'aifinesherbes_test'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', 'AliceNinon2025!'),
      ssl: env.bool('DATABASE_SSL', false),
    },
    pool: {
      min: 0,
      max: 10,
    },
  };

  // For production (Render.com), enable SSL
  if (env('NODE_ENV') === 'production') {
    connection.connection.ssl = {
      rejectUnauthorized: false,
    };
  }

  return { connection };
};
