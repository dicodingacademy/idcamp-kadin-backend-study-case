const createServer = require('./http/createServer');

(async () => {
  const server = await createServer();

  await server.start();

  console.log(`Server running at: ${server.info.uri}`);
})();
