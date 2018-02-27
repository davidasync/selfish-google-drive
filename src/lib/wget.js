const _ = require('lodash');
const fs = require('fs');
const Bluebird = require('bluebird');
const superagent = require('superagent');

const request = Bluebird.promisifyAll(superagent);
const constant = require('../../utils/constants');

/**
 * Download file from google drive
 * If you want to download google docs such as google docs / google spread sheet / google slide
 * You should use
 * @param {Object} token
 * @param {String} token.access_token
 * @param {Object} file
 * @param {String} file.id
 * @param {String} file.path
 * @returns {String}
 */
module.exports = (token, file) => {
  const accessToken = _.get(token, 'access_token');
  const fileId = _.get(file, 'id');
  const filename = _.get(file, 'path');
  const stream = fs.createWriteStream(filename);

  return new Bluebird((resolve, reject) => {
    request
      .get(`${constant.lsUrl}/${fileId}`)
      .query({
        alt: 'media',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .on('response', (response) => {
        if (response.status >= 400) {
          reject(response);
        }
      })
      .pipe(stream);

    stream.on('finish', () => {
      resolve(filename);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
};
