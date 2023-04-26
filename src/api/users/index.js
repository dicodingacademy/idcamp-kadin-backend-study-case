const UsersHandler = require('./handler');
const UsersValidator = require('./validator');
const routes = require('./routes');

const users = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { usersService }) => {
    const usersHandler = new UsersHandler(usersService, UsersValidator);
    server.route(routes(usersHandler));
  },
};

module.exports = users;
