const { nanoid } = require('nanoid');
const { createPool } = require('./pool');

class BookingsService {
  constructor(cacheService) {
    this._pool = createPool();
    this._cacheService = cacheService;
  }

  async persistBooking({
    userId, festivalId, bookingDate, quantity,
  }) {
    const bookingsId = `booking-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO bookings VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      values: [bookingsId, userId, festivalId, bookingDate, quantity, null, 0, new Date(), null],
    };

    await this._pool.query(query);

    return bookingsId;
  }

  async confirmBookings(confirmationCode) {
    const query = {
      text: 'UPDATE bookings SET status = 1 WHERE confirmation_code = $1',
      values: [confirmationCode],
    };

    await this._pool.query(query);

    // delete the cache
    const bookingId = await this.getBookingIdByConfirmationCode(confirmationCode);
    await this._cacheService.del(`booking:${bookingId}`);
  }

  async getBookingIdByConfirmationCode(confirmationCode) {
    const query = {
      text: 'SELECT id FROM bookings WHERE confirmation_code = $1',
      values: [confirmationCode],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      return null;
    }

    return rows[0].id;
  }

  async getUserIdByConfirmationCode({ confirmationCode }) {
    const query = {
      text: 'SELECT user_id FROM bookings WHERE confirmation_code = $1',
      values: [confirmationCode],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      return null;
    }

    return rows[0].user_id;
  }

  async getUserIdByBookingId(bookingId) {
    const query = {
      text: 'SELECT user_id FROM bookings WHERE id = $1',
      values: [bookingId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      return null;
    }

    return rows[0].user_id;
  }

  async getBookingById(bookingId) {
    const cacheKey = `booking:${bookingId}`;

    const cache = await this._cacheService.get(cacheKey);

    if (cache) {
      return {
        value: JSON.parse(cache),
        from: 'cache',
      };
    }

    const query = {
      text: 'SELECT * FROM bookings WHERE id = $1',
      values: [bookingId],
    };

    const { rows } = await this._pool.query(query);

    const [booking] = rows;

    delete booking.confirmation_code;

    await this._cacheService.set(cacheKey, JSON.stringify(booking));

    return {
      value: booking,
      from: 'database',
    };
  }

  async softDeleteBooking(bookingId) {
    const query = {
      text: 'UPDATE bookings SET status = -1 WHERE id = $1',
      values: [bookingId],
    };

    await this._pool.query(query);

    // delete the cache
    await this._cacheService.delete(`booking:${bookingId}`);
  }
}

module.exports = BookingsService;
