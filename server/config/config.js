const dotenv = require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DEV_USERNAME,
    "password": process.env.DEV_PASSWORD,
    "database": process.env.DEV_NAME,
    "host": process.env.DEV_HOST,
    "port": process.env.DEV_PORT,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.TEST_USERNAME,
    "password": process.env.TEST_PASSWORD,
    "database": process.env.TEST_NAME,
    "host": process.env.TEST_HOST,
    "port": process.env.TEST_PORT,
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL"
  }
}
