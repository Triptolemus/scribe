// native libraries
const fs = require('fs');

// 3rd party libraries
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

module.exports = {
  recognize_async: function (gs_uri, encoding, langCode, sampleHtz = 44100) {
    // Creates a client
    const client = new speech.SpeechClient();

    const config = {
      maxAlternatives: 2,
      enableWordTimeOffsets: true,
      encoding: encoding,
      sampleRateHertz: sampleHtz,
      languageCode: langCode // always 'en-US' ???
    };

    const audio = {
      uri: gs_uri
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
        return response;
      })
      .catch((err) => {
        throw err;
      });
  }
};
