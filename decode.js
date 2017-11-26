const fs = require('fs');

const decode = require('audio-decode');

let uri =
  'https://rss.art19.com/episodes/c0d01217-e81c-447c-adee-8a2d6188cedb.mp3';
let filename = './SampleAudio_0.4mb.mp3';

fs.readFile(filename, function (err, data) {
  if (err) {
    throw err;
  }
  console.log('decoding...');
  decode(data).then(function (x) {
    for (value in x) {
      if (x.hasOwnProperty(value)) {
        console.log(value);
      }
    };
  }).catch(function (e) {
    throw e;
  });
});
