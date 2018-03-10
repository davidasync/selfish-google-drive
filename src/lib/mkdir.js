// @flow

const _ = require('lodash');
const bluebird = require('bluebird');
const superagent = require('superagent');

const request = bluebird.promisifyAll(superagent);
const constant = require('../utils/constants');

/**
 * Make directory at google drive
 * Example output,
 * { kind: 'drive#file',
 *   id: 'somestring',
 *   name: 'efek rumah kaca',
 *   mimeType: 'application/vnd.google-apps.folder' }
 * @param {Object} token
 * @param {String} token.access_token
 * @param {String} folderName
 * @returns {Object}
 */
module.exports = (token:{access_token: String, token_type: String, expires_in: String}, folderName: string) => {
  const data = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  const accessToken = _.get(token, 'access_token');

  return request
    .post(constant.mkdirUrl)
    .send(data)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${accessToken}`)
    .endAsync();
};
