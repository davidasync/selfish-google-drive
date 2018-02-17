const _ = require('lodash');
const bluebird = require('bluebird');
const superagent = require('superagent');

const request = bluebird.promisifyAll(superagent);
const constant = require('../../utils/constants');

/**
 * Make directory at google drive
 * Example output,
 * { kind: 'drive#fileList',
 *   nextPageToken: 'somestring'
 *   incompleteSearch: false,
 *   files:
 *    [ { kind: 'drive#file',
 *        id: 'somestring',
 *        name: 'efek rumah kaca',
 *        mimeType: 'application/vnd.google-apps.folder' },
 *      { kind: 'drive#file',
 *        id: 'somestring',
 *        name: '3807540.jpg',
 *        mimeType: 'image/jpeg' } ]
 * @param {Object} token
 * @param {String} token.access_token
 * @returns {Object}
 */
module.exports = (token) => {
  const accessToken = _.get(token, 'access_token');

  return request
    .get(constant.lsUrl)
    .query({
      corpora: 'user',
      pageSize: 1000,
    })
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${accessToken}`)
    .endAsync();
};