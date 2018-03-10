const _ = require('lodash');
const bluebird = require('bluebird');
const superagent = require('superagent');

const request = bluebird.promisifyAll(superagent);
const constant = require('../utils/constants');

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
 * @param {String} searchObject.name
 * @param {String} searchObject.mimeType
 * @returns {Object}
 */
module.exports = (token, searchObject) => {
  const accessToken = _.get(token, 'access_token');
  const { name, mimeType } = searchObject;
  let gdQuery = 'trashed = false ';

  if (name) {
    gdQuery += `and name contains '${_.trim(name)}' `;
  }

  if (mimeType) {
    gdQuery += `and mimeType contains '${_.trim(mimeType)}' `;
  }

  return request
    .get(constant.lsUrl)
    .query({
      corpora: 'user',
      pageSize: 1000,
      q: gdQuery,
    })
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${accessToken}`)
    .endAsync();
};
