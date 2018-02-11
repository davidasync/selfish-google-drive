const _ = require('lodash');
const bluebird = require('bluebird');
const superagent = require('superagent');

const request = bluebird.promisifyAll(superagent);
const loadToken = require('../../utils/loadToken');
const constant = require('../../utils/constants');

/**
 * Make directory at google drive
 * @param {String} accessToken
 * @param {String} name
 * @returns {Object}
 */
// module.exports = (credential, folderName) => {
//   const data = {
//     name: folderName,
//     mimeType: 'application/vnd.google-apps.folder',
//   };

//   const closure = {};

//   return loadToken(credential)
//     .then((_token) => {
//       closure.token = _token;

//       const accessToken = _.get(closure.token, 'access_token');

//       return request
//         .post(constant.mkdirUrl)
//         .send(data)
//         .set('Accept', 'application/json')
//         .set('Authorization', `Bearer ${accessToken}`)
//         .endAsync();
//     });
// };

module.exports = (token, folderName) => {
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
