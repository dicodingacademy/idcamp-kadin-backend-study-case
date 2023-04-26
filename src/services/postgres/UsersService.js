const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const { createPool } = require('./pool');

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
}

module.exports = UsersService;
