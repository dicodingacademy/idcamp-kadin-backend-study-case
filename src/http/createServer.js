const Hapi = require('@hapi/hapi');
const config = require('../utils/config');
const ClientError = require('../exceptions/ClientError');
const users = require('../api/users');
const UsersService = require('../services/postgres/UsersService');
const authentications = require('../api/authentications');
const AuthenticationsService = require('../services/postgres/AuthenticationsService');
const JwtTokenManager = require('../tokenize/JwtTokenManager');

async function createServer() {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    host: config.application.host,
    port: config.application.port,
  });

  // register internal plugin
  await server.register([
    {
      plugin: users,
      options: {
        usersService,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        jwtTokenize: JwtTokenManager,
      },
    },
  ]);

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
