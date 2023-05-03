const { createClient } = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this._client = createClient({
      socket: {
        host: config.redis.server,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });
  }

  async _doAction(action) {
    await this._client.connect();
    const result = await action();
    await this._client.disconnect();
    return result;
  }

  async set(key, value, expirationInSecond = 3600) {
    await this._doAction(async () => {
      await this._client.set(key, value, {
        EX: expirationInSecond,
      });
    });
  }

  async get(key) {
    return this._doAction(() => this._client.get(key));
  }

  async delete(key) {
    return this._doAction(() => this._client.del(key));
  }
}

module.exports = CacheService;
