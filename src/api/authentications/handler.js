class AuthenticationsHandler {
  constructor(authenticationsService, usersService, jwtTokenize, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._jwtTokenize = jwtTokenize;
    this._validator = validator;
  }

  async postAuthenticationHandler(request, h) {
    const { email, password } = this._validator.validatePostAuthenticationPayload(request.payload);

    const id = await this._usersService.verifyUserCredential(email, password);

    const accessToken = this._jwtTokenize.generateAccessToken({ id });
    const refreshToken = this._jwtTokenize.generateRefreshToken({ id });

    await this._authenticationsService.persistRefreshToken(refreshToken);

    return h.response({
      status: 'success',
      message: 'authentication berhasil',
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);
  }
}

module.exports = AuthenticationsHandler;
