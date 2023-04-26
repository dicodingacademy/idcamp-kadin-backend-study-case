const Hapi = require('@hapi/hapi');
const config = require('../utils/config');
const ClientError = require('../exceptions/ClientError');

async function createServer() {
  const server = Hapi.server({
    host: config.application.host,
    port: config.application.port,
  });

  // interpret response with pre response middleware
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: response.message,
          data: {},
        }).code(response.statusCode);
      }

      return h.continue;
    }

    return h.continue;
  });

  return server;
}

module.exports = createServer;
