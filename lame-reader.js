'use strict';
const lame = require('lame');
const fs = require('fs');

let mp3file = './SampleAudio_0.4mb.mp3';
let input = fs.createReadStream(mp3file);
// let output = fs.createWriteStream(outfile);

// start reading the MP3 file from the input
let decoder = new lame.Decoder();

// we have to wait for the "format" event before we can start encoding
decoder.on('format', function (format) {
  console.error('MP3 format: %j', format);

  // write the decoded MP3 data into a WAV file
  // let writer = new wav.Writer(format);
  // decoder.pipe(writer).pipe(output);
});

// and start transferring the data
input.pipe(decoder);
