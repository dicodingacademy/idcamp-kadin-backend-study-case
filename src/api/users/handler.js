const InvariantError = require('../../exceptions/InvariantError');

class UsersHandler {
  constructor(usersService, storageService, validator) {
    this._usersService = usersService;
    this._storageService = storageService;
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

  async patchUsersMeIdCardHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { images } = this._validator.validatePatchUserPayload(request.payload);
    const { hapi: meta } = images;

    const filename = await this._storageService.uploadUserIdCard(userId, images, meta);
    await this._usersService.updateIdCardUser(userId, filename);

    return {
      status: 'success',
      message: 'id card berhasil diperbarui',
      data: {},
    };
  }
}

module.exports = UsersHandler;
