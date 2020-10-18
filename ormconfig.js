const cfg = require('./config');

const config = {
  development: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'niftycrates',
    synchronize: true,
    logging: false,
    entities: ['dist/server/entity/**/*.js'],
    migrations: ['dist/server/migration/**/*.js'],
    subscribers: ['server/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'server/entity',
      migrationsDir: 'server/migration',
      subscribersDir: 'server/subscriber',
    },
  },
  production: {
    type: 'postgres',
    host: cfg.DB_HOST,
    port: cfg.DB_PORT,
    username: cfg.DB_USER,
    password: cfg.DB_PASSWORD,
    database: 'niftycrates',
    synchronize: true,
    logging: false,
    entities: ['dist/server/entity/**/*.js'],
    migrations: ['dist/server/migration/**/*.js'],
    subscribers: ['server/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'server/entity',
      migrationsDir: 'server/migration',
      subscribersDir: 'server/subscriber',
    },
  },
};

module.exports = config[process.env.NODE_ENV] || config.development;
