const dotenv = require('dotenv');

dotenv.config();

const config = {
  application: {
    host: process.env.APPLICATION_HOST,
    port: process.env.APPLICATION_PORT,
    publicUrl: process.env.APPLICATION_PUBLIC_URL,
  },
  postgres: {
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  },
  jwtTokenize: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
  },
};

module.exports = config;
