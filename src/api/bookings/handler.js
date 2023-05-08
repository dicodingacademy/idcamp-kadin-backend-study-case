const ForbiddenError = require('../../exceptions/ForbiddenError');
const InvariantError = require('../../exceptions/InvariantError');

class BookingsHandler {
  constructor(bookingsService, festivalsService, queueService, validator) {
    this._bookingsService = bookingsService;
    this._festivalsService = festivalsService;
    this._queueService = queueService;
    this._validator = validator;
  }

  async postBookingHandler(request, h) {
    const { id: userId } = request.auth.credentials;

    const {
      festivalId,
      quantity, bookingDate,
    } = this._validator.validatePostBookingPayload(request.payload);

    const isFestivalAvailable = await this._festivalsService.isFestivalAvailable(festivalId);

    if (!isFestivalAvailable) {
      throw new InvariantError('festival tidak valid');
    }

    const bookingId = await this._bookingsService.persistBooking({
      userId,
      festivalId,
      quantity,
      bookingDate,
    });

    const queueMessage = JSON.stringify({ bookingId });

    await this._queueService.sendMessage('booking:send_confirmation', queueMessage);

    return h.response({
      status: 'success',
      message: 'konfirmasi booking akan dikirimkan melalui email',
      data: {
        bookingId,
      },
    }).code(201);
  }

  async getBookingConfirmHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { confirmationCode } = request.params;

    const owner = await this._bookingsService.getUserIdByConfirmationCode(confirmationCode);

    if (owner !== userId) {
      throw new ForbiddenError('anda tidak berhak mengakses resource ini');
    }

    const booking = await this._bookingsService.confirmBookings(confirmationCode);

    return {
      status: 'success',
      data: {
        booking,
      },
    };
  }

  async getBookingByIdHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: bookingId } = request.params;

    const owner = await this._bookingsService.getUserIdByBookingId(bookingId);

    if (owner !== userId) {
      throw new ForbiddenError('anda tidak berhak mengakses resource ini');
    }

    const { value, from } = await this._bookingsService.getBookingById(bookingId);

    const response = h.response({
      status: 'success',
      message: 'booking berhasil ditemukan',
      data: {
        booking: value,
      },
    });

    response.header('X-Data-Source', from);
    return response;
  }

  async deleteBookingByIdHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { id: bookingId } = request.params;

    const owner = await this._bookingsService.getUserIdByBookingId(bookingId);

    if (owner !== userId) {
      throw new ForbiddenError('anda tidak berhak mengakses resource ini');
    }

    await this._bookingsService.softDeleteBooking(bookingId);

    await this._queueService.sendMessage('booking:delete', JSON.stringify({ bookingId }));

    return {
      status: 'success',
      message: 'booking berhasil dihapus',
      data: {},
    };
  }
}

module.exports = BookingsHandler;
