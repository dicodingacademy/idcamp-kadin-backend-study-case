const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const config = require('../utils/config');
const ClientError = require('../exceptions/ClientError');
const users = require('../api/users');
const UsersService = require('../services/postgres/UsersService');
const authentications = require('../api/authentications');
const AuthenticationsService = require('../services/postgres/AuthenticationsService');
const JwtTokenManager = require('../tokenize/JwtTokenManager');
const festivals = require('../api/festivals');
const FestivalsService = require('../services/postgres/FestivalsService');
const LocalStorageService = require('../services/storages/LocalStorageService');
const BookingsService = require('../services/postgres/BookingsService');
const QueueService = require('../services/rabbitmq/QueueService');
const bookings = require('../api/bookings');

async function createServer() {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const festivalsService = new FestivalsService();
  const storageService = new LocalStorageService();
  const bookingsService = new BookingsService();
  const queueService = new QueueService();

  const server = Hapi.server({
    host: config.application.host,
    port: config.application.port,
  });

  // register external plugin
  await server.register([
    {
      plugin: Jwt.plugin,
    },
    {
      plugin: Inert,
    },
  ]);

  // define auth strategy
  server.auth.strategy(config.application.authenticationName, 'jwt', {
    keys: config.jwtTokenize.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwtTokenize.accessTokenAges,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // register internal plugin
  await server.register([
    {
      plugin: users,
      options: {
        usersService,
        storageService,
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
    {
      plugin: festivals,
      options: {
        festivalsService,
      },
    },
    {
      plugin: bookings,
      options: {
        bookingsService,
        festivalsService,
        queueService,
      },
    },
  ]);

  // interpret response with pre response middleware
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      return h.response({
        status: 'fail',
        message: response.message,
        data: {},
      }).code(response.statusCode);
    }

    return h.continue;
  });

  return server;
}

module.exports = createServer;
