const _ = require('lodash');
const fs = require('fs');
const bluebird = require('bluebird');
const superagent = require('superagent');
const readChunk = require('read-chunk');
const fileType = require('file-type');

const request = bluebird.promisifyAll(superagent);
const constant = require('../../utils/constants');

const uploadFile = (name, contentType, data, accessToken) => {
  const boundary = `-------${name}`;
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name,
    mimeType: contentType,
  };

  let multipartRequestBody = delimiter +  'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: ' + contentType + '\r\n';

  //Transfer images as base64 string.
  if (contentType.indexOf('image/') === 0) {
    const pos = data.indexOf('base64,');
    multipartRequestBody += 'Content-Transfer-Encoding: base64\r\n\r\n' +
        data.slice(pos < 0 ? 0 : (pos + 'base64,'.length));
  } else {
      multipartRequestBody +=  + '\r\n' + data;
  }

  multipartRequestBody += closeDelimiter;

  return request.post(constant.scp)
    .query({
      uploadType: 'multipart',
    })
    .set('Content-Type', `multipart/form-data;  boundary="${boundary}"`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(multipartRequestBody)
    .endAsync();
};


module.exports = (token, file) => {
  const accessToken = _.get(token, 'access_token');
  const { name, path } = file;
  const buffer = readChunk.sync(path, 0, 4100);

  const data = fs.readFileSync(path).toString('base64');
  const { ext, mime } = fileType(buffer);

  return uploadFile(`${name}.${ext}`, mime, data, accessToken);
};
