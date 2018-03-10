const _ = require('lodash');
const fs = require('fs');
const Bluebird = require('bluebird');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const request = Bluebird.promisify(require('request'));

const constant = require('../utils/constants');

/**
 * Upload a file to google drive
 * @param {Object} token
 * @param {String} token.access_token
 * @param {Object} file
 * @param {String} file.name
 * @param {String} file.path
 * @param {String} file.folderId
 * @returns {Promise.<Object>}
 */
module.exports = (token, file) => {
  const accessToken = _.get(token, 'access_token');
  const { name, path, folder } = file;
  const buffer = readChunk.sync(path, 0, 4100);

  const { ext, mime } = fileType(buffer);
  const filename = `${name}.${ext}`;

  const jsonMultipart = {
    name: filename,
  };

  if (folder) {
    if (!_.isArray(folder)) {
      _.set(jsonMultipart, 'parents', [folder]);
    } else {
      _.set(jsonMultipart, 'parents', folder);
    }
  }

  return request({
    method: 'POST',
    url: constant.scp,
    qs: {
      uploadType: 'multipart',
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    multipart: [
      {
        'Content-Type': 'application/json; charset=UTF-8',
        body: JSON.stringify(jsonMultipart),
      },
      {
        'Content-Type': mime,
        body: fs.readFileSync(path),
      },
    ],
  })
    .then((response) => {
      if (response.statusCode >= 400) {
        return Bluebird.reject(response);
      }

      return Bluebird.resolve(response);
    });
};
