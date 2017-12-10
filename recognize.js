// native libraries
const fs = require('fs');

// 3rd party libraries
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

module.exports = {
  recognize_async: function (filename, encoding, langCode, sampleHtz = 44140) {
  // Creates a client
  const client = new speech.SpeechClient();

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleHtz,
    languageCode: langCode // always 'en-US' ???
  };

  const file = fs.readFileSync(filename);
  const audioBytes = file.toString('base64');

  const audio = {
    content: audioBytes
  };

  const request = {
    config: config,
    audio: audio
  };

  console.log('sending request!');

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  return client
    .longRunningRecognize(request)
    .then((data) => {
      const operation = data[0];
      console.log('got data');
      // Get a Promise representation of the final result of the job
      return operation.promise();
    })
    .then((data) => {
      const response = data[0];
      const transcription = response.results
        .map((result) => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
      return transcription;
    })
    .catch((err) => {
      throw err;
      // console.error('ERROR:', err);
    });
  }
};
