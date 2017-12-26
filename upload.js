'use strict';

const Storage = require('@google-cloud/storage');
const storage = new Storage();

// module uploads target file to a google bucket
module.exports = function (bucket, target) {
  console.log('Uploading to google storage.');

  let upload = function (bucket, target) {
    return storage.bucket(bucket).upload(target)
  };

  return upload(bucket, target);
};




