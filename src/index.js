
const _ = require('lodash');
const Bluebird = require('bluebird');
const mkdir = require('./lib/mkdir');

const loadToken = require('../utils/loadToken');
const constants = require('../utils/constants');

const library = {
  mkdir,
};

/**
 * Load all possible wrapper google drive api
 * @param {Object} credential
 * @param {String} credential.clientID
 * @param {String} credential.clientSecret
 * @param {String} credential.refreshToken
 * @return {Object.<function>}
 */
module.exports = (credential) => {
  const mainFuncs = _.mapValues(library, _func => (params) => {
    const func = shouldRefreshToken => loadToken(credential, shouldRefreshToken)
      .then(token => _func(token, params));

    const closure = {};

    closure.maxTry = constants.MAX_ERROR_TRY;

    return func()
      .catch((error) => {
        // 401 can happened because access token already expired
        if (error.status !== 401) {
          Bluebird.reject(error.message);
        }

        closure.maxTry -= 1;

        // Force func load token to refresh token
        return func(true);
      });
  });

  _.assign(mainFuncs, { loadToken: _.partial(loadToken, credential) });

  return mainFuncs;
};
