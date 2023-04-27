const { createPool } = require('./pool');
const NotFoundError = require('../../exceptions/NotFoundError');

class FestivalsService {
  constructor() {
    this._pool = createPool();
  }

  async getFestivals() {
    const result = await this._pool.query('SELECT * FROM festivals');
    return result.rows;
  }

  async getFestival(id) {
    const query = {
      text: 'SELECT * FROM festivals WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('festival tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = FestivalsService;
