const exec = require('./execute.js');

let mp3 = './source/samplemp3.mp3';
// let cmd = `ffprobe -i ${mp3} -show_entries format=duration -v quiet -of csv="p=0"`
let cmd = `ffmpeg -i ${mp3} -af "pan=mono|c0=c1" ./source/singlechan.flac`;

// convert the file 
exec(cmd).then(function (output) {
  console.log('stdout: ' + output.stdout);
  console.log('stderr: ' + output.stderr);
  console.log('Finished executing command!');
}).catch(function (e) {
  console.log(e);
})

console.log('executing promise!');
