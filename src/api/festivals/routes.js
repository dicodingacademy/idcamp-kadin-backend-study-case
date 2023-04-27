const routes = (handler) => [
  {
    method: 'GET',
    path: '/festivals',
    handler: (request, h) => handler.getFestivalsHandler(request, h),
  },
  {
    method: 'GET',
    path: '/festivals/{id}',
    handler: (request, h) => handler.getFestivalByIdHandler(request, h),
  },
];

module.exports = routes;
