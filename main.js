const fs = require('fs');
const path = require('path');

// local parameters
const local = require('./local/local.js');
// mail function
const mailer = require('./email.js');
// google speech function
const scribe = require('./recognize.js');
// arg parsing module
const arg_parser = require('./arguments.js');
// logger module
const logger = require('./logger.js');
// download module 
const download = require('./download.js');
// command line execution module
const execute = require('./execute.js');
// very simple range array generator
const range = require('./range.js');
// module that uploads file to google bucket
const upload = require('./upload.js');
// module that merges two strings
const merge = require('./merge.js');

// prepare variables
let log_filename = 'local/log.csv';
let uri = arg_parser();
let ext = path.extname(uri);
let audio_dir = './source/';
let to_address = 'wallace.forman@gmail.com';
let bucket = 'speech-primus-bucket';

// process.exit();

// SET APIKEY IN ENVIRONMENTAL VARIABLES (api key for google speech)
process.env.GOOGLE_APPLICATION_CREDENTIALS = local.apikey;

//////////
// commence main block!!!
////////////
// get job id from log
return logger(log_filename, uri).then((job_id) => {
  console.log('job id is: ', job_id);
  // download the target, keep the job id
  let output = audio_dir + job_id + ext;
  return Promise.all([
    job_id,
    download(uri, output)
  ]);
}).then((results) => {
  console.log('converting to flac');
  // keep job id, convert left stream only to flac
  let job_id = results[0];
  let sourcefile = audio_dir + job_id + ext;;
  let flacfile = audio_dir + job_id + '.flac';
  // command to convert left stream to flac file
  let cmd1 = `ffmpeg -i ${sourcefile} -af "pan=mono|c0=c0" ${flacfile}`;
  
  return Promise.all([
    job_id,
    execute(cmd1), // convert to flac
  ]); 
}).then((results) => {
  // keep job id, upload flac file to google storage)
  let job_id = results[0];
  let target = audio_dir + job_id + '.flac';

  return Promise.all([
    job_id,
    upload(bucket, target)
  ]);
}).then((results) => {
  console.log('creating transcription jobs');
  // invoke google speech recognition api on stored file 
  let job_id = results[0];
  let filename = job_id + '.flac';
  let gs_uri = `gs://${bucket}/${filename}`;

  return Promise.all([
    job_id,
    scribe.recognize_async(gs_uri, 'FLAC', 'en-US', 44100) // add samplHtz!!!
  ]);
}).then((results) => {
  console.log('finished transcription jobs! Sending email...');
  // combine the transcriptions and feed to mailer
  let job_id = results[0];
  let response = results[1];
  
  let transcription = response.results
    .map((result) => merge(result.alternatives[0].transcript, result.alternatives[1].transcript))
    .join('\n');
  console.log(`Transcription: ${transcription}`);
  
  let subject = '[Scribe Job #' + job_id + ']';

  return mailer.send_email(
    to_address,
    subject,
    transcription
  );
}).catch((e) => {
  console.log(e);
  return mailer.send_email(
    'wallace.forman@gmail.com',
    'Scribe Error',
    'Error:' + e
  );
});
