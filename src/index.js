const _ = require('lodash');
const getAccessToken = require('./lib/getAccessToken');

const library = {
  getAccessToken,
};

/**
 * Load all possible wrapper google drive api
 * @param {Object} credential
 * @param {Object} credential.clientID
 * @param {Object} credential.clientSecret
 * @param {Object} credential.refreshToken
 * @return {Object.<function>}
 */
module.exports = (credential) => {
  const clientID = _.get(credential, 'clientID');
  const clientSecret = _.get(credential, 'clientSecret');
  const refreshToken = _.get(credential, 'refreshToken');

  if (!clientID || !clientSecret || !refreshToken) {
    throw new Error('Should provide clientId, clientSecret, and refreshToken');
  }

  return _.mapValues(library, func => _.partial(func, credential));
};
