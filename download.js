// native requires
const fs = require('fs');

// import requests
const request = require('request');

let filename = './test.txt';

module.exports = {
  download (uri) {
    console.log('download running');

    // promise wrapper on request interface
    let p = new Promise((resolve, reject) => {
      console.log('sending request');
      return request.get(uri)
      .on('error', reject)
      .pipe(fs.createWriteStream(filename)
      .on('error', reject)
      .on('close', function () {
        console.log('write stream done');
        return resolve(filename);
      })
    );
  });

  p.then(function (fn) {
    console.log('file: ', fn);
  }).catch(function (e) {
    console.log('throwing error');
    throw e;
  });
  }
};
