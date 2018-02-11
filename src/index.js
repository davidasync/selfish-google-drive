const _ = require('lodash');

const mkdir = require('./lib/mkdir');

const loadToken = require('../utils/loadToken');
const promise = require('../utils/promise');

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
  const mainFuncs = _.mapValues(library, func => params => loadToken(credential)
    .then(token => func(token, params)));

  _.assign(mainFuncs, { loadToken: _.partial(loadToken, credential) });

  return mainFuncs;
};
