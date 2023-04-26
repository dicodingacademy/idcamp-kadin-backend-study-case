const dotenv = require('dotenv');

dotenv.config();

const config = {
  application: {
    host: process.env.APPLICATION_HOST,
    port: process.env.APPLICATION_PORT,
  },
};

module.exports = config;
