const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const { createPool } = require('./pool');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = createPool();
  }

  async persistUsers(user) {
    const id = `user-${nanoid(16)}`;
    const { name, email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, name, email, hashedPassword],
    };

    await this._pool.query(query);

    return {
      id,
      name,
      email,
    };
  }

  async isEmailAvailable(email) {
    const query = {
      text: 'SELECT id FROM users WHERE email = $1',
      values: [email],
    };
    const result = await this._pool.query(query);

    return !result.rowCount > 0;
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE email = $1',
      values: [email],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('kredensial yang Anda berikan salah');
    }

    return id;
  }

  async updateIdCardUser(userId, idCardUrl) {
    const query = {
      text: 'UPDATE users SET id_card_name = $1 WHERE id = $2',
      values: [idCardUrl, userId],
    };

    await this._pool.query(query);
  }

  async getUserIdCard(userId) {
    const query = {
      text: 'SELECT id_card_name FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = UsersService;
