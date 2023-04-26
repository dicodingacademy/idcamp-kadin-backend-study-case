const dotenv = require('dotenv');

dotenv.config();

const config = {
  application: {
    host: process.env.APPLICATION_HOST,
    port: process.env.APPLICATION_PORT,
  },
  postgres: {
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  },
};

module.exports = config;
