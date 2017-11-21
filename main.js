const fs = require('fs');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

const mailer = require('./email.js');
const local = require('./local/local.js');

// SET APIKEY IN ENVIRONMENTAL VARIABLES
process.env.GOOGLE_APPLICATION_CREDENTIALS = local.apikey;

// The name of the audio file to transcribe
const fileName = './test7.flac';

mailer.send_email('wallace.forman@gmail.com', 'hello', 'body');

// Creates a client
const client = new speech.SpeechClient({
  projectId: local.project
});

// Reads a local audio file and converts it to base64
const file = fs.readFileSync(fileName);
const audioBytes = file.toString('base64');

// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const audio = {
  content: audioBytes
};
const config = {
  encoding: 'FLAC',
  // sampleRateHertz: 16000,
  languageCode: 'en-US'
};
const request = {
  audio: audio,
  config: config
};

// Detects speech in the audio file
client
  .recognize(request)
  .then((data) => {
    const response = data[0];
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
