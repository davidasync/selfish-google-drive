// @flow

const _ = require('lodash');
const fs = require('fs');
const bluebird = require('bluebird');
const superagent = require('superagent');

const request = bluebird.promisifyAll(superagent);
const constant = require('../utils/constants');

/**
 * Get access token
 * Response body should be like this
 * {
 *   access_token: 'somestring'
 *   token_type: 'Bearer',
 *   expires_in: '3600'
 * }
 * @param {Object} credential
 * @param {String} credential.clientID
 * @param {String} credential.clientSecret
 * @param {String} credential.refreshToken
 * @return {Object}
 */
module.exports = (credential: {clientID: String, clientSecret: String, refreshToken: String}) => {
  const data = {
    grant_type: 'refresh_token',
    client_id: _.get(credential, 'clientID'),
    client_secret: _.get(credential, 'clientSecret'),
    refresh_token: _.get(credential, 'refreshToken'),
  };

  return request
    .post(constant.refreshTokenUrl)
    .send(data)
    .set('content-type', 'application/x-www-form-urlencoded')
    .endAsync()
    .then((response) => {
      if (_.get(response, 'statusCode') !== 200) {
        throw new Error(_.get(response, 'body'));
      }

      const token = _.get(response, 'body');

      fs.writeFileSync('sgd-token.json', JSON.stringify(token, null, 2), 'utf8');

      return bluebird.resolve(token);
    });
};
