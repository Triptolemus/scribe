const exec = require('./execute.js');

exec('ffmpeg -i input.mp3 -f null -').then(console.log)
  .catch((e) => throw e);
