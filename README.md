# URL-Scribe

## Description
This module downloads an audio file, processes it to a single-channel flac file, then uploads it, feeds it to the Google Speech API, and transmits the transcript received back to an email account designated in the configuration file.

## Usage
`node main.js http://your.favorite.podcast.com/episode1.mp3`

## Dependencies

* Google Speech API
* Google Storage Access and API
* The FFmpeg and FFprobe command line utilities

## Configuration
You must obtain Google API credentials and add them to your project in order to use the Google Speech and Storage dependencies.
See here:
https://support.google.com/cloud/answer/6158862?hl=en

A Google Storage Bucket must be available and accessible to your project.

The default configuration requires email credentials to transmit the transcription results, as well as a target email address to receive this transmission. This may not fit your needs, so adjust as desired.

The following local configuration file must be added to `local/local.js` with the relevant configuration for your instance:

```javascript
module.exports = {
  // SMTP credentials for the email account used to send email. Currently filled with fake example values.
  host: smtp@example.com,
  port: 465,
  secure: true,
  email: some.email@example.com,
  pw: 'some-password',
  
  project: 'my-project-12345', // name of your Google project with access to Speech and Storage apis
  apikey: '/home/user/project/scribe/local/credentials.json', // path to your Google apikey credentials
  bucket: 'my-project-bucket', // name of the Google storage bucket available for your project.
  
  // The receipt address for your transcription
  to_addr: 'some.other.email@example.com',
}
```
