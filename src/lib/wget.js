const _ = require('lodash');
const fs = require('fs');
const Bluebird = require('bluebird');
const superagent = require('superagent');

const request = Bluebird.promisifyAll(superagent);
const constant = require('../../utils/constants');
const GDMimeType = require('../../utils/GDMimeType');

/**
 * Download file from google drive
 * @param {Object} token
 * @param {String} token.access_token
 * @param {Object} file
 * @param {String} file.id
 * @param {String} file.path
 * @returns {String}
 */
const downloadBinaryFile = (token, file) => {
  const accessToken = _.get(token, 'access_token');
  const fileId = _.get(file, 'id');
  const filePath = _.get(file, 'path');
  const stream = fs.createWriteStream(filePath);

  return new Bluebird((resolve, reject) => {
    request
      .get(`${constant.wget}/${fileId}`)
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
      resolve(filePath);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
};

/**
 * Export google drive mimetype to desired mimetype
 * Check the supported mimetype at
 * https://developers.google.com/drive/v3/web/manage-downloads
 * @param {Object} token
 * @param {String} token.access_token
 * @param {Object} file
 * @param {String} file.id
 * @param {String} file.path
 * @param {String} file.exportTo
 * @param {String} file.mimeType
 * @returns {String}
 */
const exportGD = (token, file) => {
  const accessToken = _.get(token, 'access_token');
  const fileId = _.get(file, 'id');
  const filePath = _.get(file, 'path');
  const mimeType = _.get(file, 'mimeType');
  const exportTo = _.get(file, 'exportTo', GDMimeType[mimeType]);
  const stream = fs.createWriteStream(filePath);

  return new Bluebird((resolve, reject) => {
    request
      .get(`${constant.lsUrl}/${fileId}/export`)
      .query({
        mimeType: exportTo,
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
      resolve(filePath);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
};

/**
 * Download file from google drive
 * @param {Object} token
 * @param {Object} file
 * @param {String} file.mimeType
 * @returns {String}
 */
module.exports = (token, file) => {
  const mimeType = _.get(file, 'mimeType');

  if (!GDMimeType[mimeType]) {
    return downloadBinaryFile(token, file);
  }

  return exportGD(token, file);
};
