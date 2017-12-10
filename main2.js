const fs = require('fs');

// local parameters
const local = require('./local/local.js');
// mail function
const mailer = require('./email.js');
// google speech function
const scribe = require('./recognize.js');
// argument parser
const arg_parser = require('./arguments.js');
// download function
// const download = require('./download.js');

let uri = arg_parser.parse_args();
// download.get_file(uri);

// process.exit();

// SET APIKEY IN ENVIRONMENTAL VARIABLES (api key for google speech)
process.env.GOOGLE_APPLICATION_CREDENTIALS = local.apikey;

// The name of the audio file to transcribe
const filename = './test.flac';

return scribe.recognize_async(uri, 'LINEAR16', 'en-US')
  .then(function (transcription) {
    console.log(transcription);
    return mailer.send_email(
      'wallace.forman@gmail.com',
      'Scribe Text',
      transcription
    );
  }).catch(function (e) {
    console.log(e);
    return mailer.send_email(
      'wallace.forman@gmail.com',
      'Scribe Error',
      'Error:' + e
    );
  });
