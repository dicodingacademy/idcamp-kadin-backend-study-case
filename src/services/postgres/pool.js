const { Pool } = require('pg');
const config = require('../../utils/config');

let pool = null;

function createPool() {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    host: config.postgres.host,
    port: config.postgres.port,
    user: config.postgres.user,
    database: config.postgres.database,
    password: config.postgres.password,
  });

  return pool;
}

module.exports = { createPool };
