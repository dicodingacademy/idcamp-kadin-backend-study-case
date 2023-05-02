const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const PostBookingPayloadSchema = Joi.object({
  festivalId: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
  bookingDate: Joi.date().iso().required(),
});

const BookingsValidator = {
  validatePostBookingPayload(payload) {
    const validationResult = PostBookingPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

module.exports = BookingsValidator;
