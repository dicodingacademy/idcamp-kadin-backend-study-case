const InvariantError = require('../../exceptions/InvariantError');

class UsersHandler {
  constructor(usersService, validator) {
    this._usersService = usersService;
    this._validator = validator;
  }

  async postUserHandler(request, h) {
    const user = this._validator.validatePostUserPayload(request.payload);

    // checking availability of email
    const isEmailAvailable = await this._usersService.isEmailAvailable(user.email);
    if (!isEmailAvailable) {
      throw new InvariantError('email sudah digunakan');
    }

    // persist user
    const createdUser = await this._usersService.persistUsers(user);

    // response with persisted user
    return h.response({
      status: 'success',
      message: 'user berhasil ditambahkan',
      data: {
        createdUser,
      },
    }).code(201);
  }
}

module.exports = UsersHandler;
