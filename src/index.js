
const _ = require('lodash');
const Bluebird = require('bluebird');

const mkdir = require('./lib/mkdir');
const ls = require('./lib/ls');
const find = require('./lib/find');
const wget = require('./lib/wget');
const scp = require('./lib/scp');

const loadToken = require('./utils/loadToken');
const constants = require('./utils/constants');

const library = {
  mkdir,
  ls,
  find,
  wget,
  scp,
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
      .then(token => _func(token, params))
      .then((response) => {
        if (_.get(response, 'body')) {
          return _.get(response, 'body');
        }

        return response;
      });

    const closure = {};

    closure.maxTry = constants.MAX_ERROR_TRY;

    return func()
      .catch((response) => {
        const responseStatus = response.status || response.statusCode;

        // 401 can happened because access token already expired
        if (responseStatus !== 401) {
          return Bluebird.reject(response.message || response.error || response);
        }

        if (closure.maxTry <= 0) {
          return Bluebird.reject('Max try already exceeded');
        }

        closure.maxTry -= 1;

        // Force func load token to refresh token
        return func(true);
      });
  });

  // Add load token to main library function
  _.assign(mainFuncs, { loadToken: _.partial(loadToken, credential) });

  return mainFuncs;
};
