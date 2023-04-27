const Jwt = require('@hapi/jwt');
const config = require('../utils/config');
const AuthenticationError = require('../exceptions/AuthenticationError');

const JwtTokenManager = {
  generateAccessToken(payload) {
    return Jwt.token.generate(payload, config.jwtTokenize.accessTokenKey);
  },

  generateRefreshToken(payload) {
    return Jwt.token.generate(payload, config.jwtTokenize.refreshTokenKey);
  },

  verifyRefreshToken(refreshToken) {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, config.jwtTokenize.refreshTokenKey);
      const { payload } = artifacts.decoded;
      return payload;
    } catch {
      throw new AuthenticationError('refresh token tidak valid');
    }
  },
};

module.exports = JwtTokenManager;
