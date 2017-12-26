// native requires
const fs = require('fs');

// import requests
const request = require('request');

module.exports = function (uri, filename) {

  // promise wrapper on request interface
  return new Promise((resolve, reject) => {
    console.log('sending request');
    return request.get(uri)
    .on('error', reject)
    .pipe(fs.createWriteStream(filename))
    .on('error', reject)
    .on('close', function () {
      console.log('write stream done');
      return resolve(filename);
    });
  });

  p.then(function (fn) {
    console.log('file: ', fn);
  }).catch(function (e) {
    console.log('throwing error');
    throw e;
  });
};
