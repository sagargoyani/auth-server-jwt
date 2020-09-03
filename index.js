/*!
 * auth-server-jwt
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var cookieParser = require('cookie-parser')
var jwt = require("jsonwebtoken")
let jwt_secret = false;

/**
 * Module exports.
 * @public
 */

module.exports = authServer
module.exports.check = check

/**
 * Get the secret string
 * Parse Cookie header and populate `req.cookies` with cookie parser
 *
 * @param {string} [secret] A string of the secret for jwt.
 * @return {Function}
 * @public
 */

function authServer(secret) {
  if (secret) {
    jwt_secret = secret;
  } else {
    throw new Error("jwt token not provided.");
  }

  return cookieParser();
}

/**
 * router middleware to check and authorize the request.
 * Parse token and populate `req.userData`
 *
 * @public
 */

async function check(req, res, next) {
  if (!jwt_secret) {
    throw new Error("The auth server middleware must be initialize before.");
  }

  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw new ClientError("Access token not found in request", 400);
    }

    const verifyData = await verifyAccessToken(token);

    if (!verifyData) {
      throw new ClientError("token invalid or expired", 401);
    }

    req.userData = verifyData;
    req.userId = verifyData.id;

    return next();
  } catch (error) {
    next(error);
  }
}

/**
 * Get the token string
 * verify the token with jwt and stored secret
 *
 * @param {string} [token] A string of the jwt token.
 * @return {object|boolean}
 * @private
 */

const verifyAccessToken = async token => {
  try {
    const data = await jwt.verify(token, jwt_secret);

    return data;
  } catch (err) {
    return false;
  }
};

/**
 * a custom client error with httpCode
 * default httpCode 500
 *
 * @private
 */

class ClientError extends Error {
  constructor(message, httpCode = 500) {
    super(message);
    this.status = httpCode;
  }
}