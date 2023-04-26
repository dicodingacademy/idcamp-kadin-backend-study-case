const Hapi = require('@hapi/hapi');
const config = require('../utils/config');

async function createServer() {
  return Hapi.server({
    host: config.application.host,
    port: config.application.port,
  });
}

module.exports = createServer;
