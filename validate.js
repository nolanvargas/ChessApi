// This file will hold the code to validate the JWTs that are sent to the GraphQL server.

require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

/**
 * @param {*} header
 * @param {*} callback
 */
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (error, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// The function isTokenValid checks the validity
// of a JWT by using the verify function from the library jsonwebtoken,
// which uses your AUTH0_DOMAIN and API_IDENTIFIER values from Auth0.
// These values are loaded from the process.env variable with dotenv
// and are used to create a jwksClient with the library jwks-rsa

/**
 * @param {*} token
 */
async function isTokenValid(token) {
  if (token) {
    const bearerToken = token.split(' ');

    const result = new Promise((resolve, reject) => {
      jwt.verify(
        bearerToken[1],
        getKey,
        {
          audience: process.env.API_IDENTIFIER,
          issuer: `https://${process.env.AUTH0_DOMAIN}/`,
          algorithms: ['RS256'],
        },
        (error, decoded) => {
          if (error) {
            reject(new Error(error));
          }
          if (decoded) {
            resolve({ decoded });
          }
        },
      );
    });

    return result;
  }

  throw new Error('No token provided');
}

module.exports = isTokenValid;
