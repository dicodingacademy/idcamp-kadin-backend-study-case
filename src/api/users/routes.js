const config = require('../../utils/config');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.postUserHandler(request, h),
  },
  {
    method: 'PATCH',
    path: '/users/me/id-cards',
    handler: (request, h) => handler.patchUsersMeIdCardHandler(request, h),
    options: {
      auth: config.application.authenticationName,
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
      },
    },
  },
];

module.exports = routes;
