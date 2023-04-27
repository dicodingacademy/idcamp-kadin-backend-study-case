const { createPool } = require('./pool');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class AuthenticationsService {
  constructor() {
    this._pool = createPool();
  }

  async persistRefreshToken(refreshToken) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [refreshToken],
    };

    await this._pool.query(query);
  }

  async deleteRefreshToken(refreshToken) {
    const query = {
      text: 'DELETE FROM authentications WHERE refresh_token = $1',
      values: [refreshToken],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(refreshToken) {
    const query = {
      text: 'SELECT * FROM authentications WHERE refresh_token = $1',
      values: [refreshToken],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('refresh token tidak valid');
    }
  }
}

module.exports = AuthenticationsService;
