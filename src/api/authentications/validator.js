const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const PostAuthenticationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const PutAuthenticationSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const AuthenticationsValidator = {
  validatePostAuthenticationPayload(payload) {
    const validationResult = PostAuthenticationSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },

  validatePutAuthenticationPayload(payload) {
    const validationResult = PutAuthenticationSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },

  validateDeleteAuthenticationPayload(payload) {
    const validationResult = DeleteAuthenticationSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

module.exports = AuthenticationsValidator;
