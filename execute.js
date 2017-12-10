const { exec } = require('child_process');

module.exports = function (command) {

  return new Promise((resolve, reject) => {
    return exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject(err);  
      }
      return resolve({
        stdout: stdout,
        stderr: stderr
      });
    });
  });
}
