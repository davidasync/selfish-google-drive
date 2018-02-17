const _ = require('lodash');
const fs = require('fs');
const bluebird = require('bluebird');

const getToken = require('../src/lib/getToken');

/**
 * Create / load token from json file
 * Example output
 * {
 *   access_token: 'somestring'
 *   token_type: 'Bearer',
 *   expires_in: '3600'
 * }
 * @param {Object} credential
 * @param {Object} credential.clientID
 * @param {Object} credential.clientSecret
 * @param {Object} credential.refreshToken
 * @return {Object.<function>}
 */
module.exports = (credential, shouldRefreshToken) => {
  const clientID = _.get(credential, 'clientID');
  const clientSecret = _.get(credential, 'clientSecret');
  const refreshToken = _.get(credential, 'refreshToken');

  if (!clientID || !clientSecret || !refreshToken) {
    throw new Error('Should provide clientId, clientSecret, and refreshToken');
  }

  if (!(fs.existsSync('token.json')) || shouldRefreshToken) {
    return getToken(credential);
  }

  const token = JSON.parse(fs.readFileSync('token.json', { encoding: 'utf8' }));

  return bluebird.resolve(token);
};
