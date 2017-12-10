t fs = require('fs');
const csv = require('csv');
const os = require('os');

// opens log, checks last entry id, then adds new entry and returns id
module.exports = function (log_filename, url) {
  // wrap function in promise for return
  return new Promise((resolve, reject) => {
    // open target file and get file descriptor
    fs.open(log_filename, 'r+', (err, fd) => {
      if (err) return reject(err);
      // stream file data to csv parser
      let last_line = [];
      // create readstream from file
      fs.createReadStream('path-ignored', { // fd used instead
        autoClose: false, // keep file open for append after read
        fd: fd // fd is used instead of path
      }).pipe(csv.parse({}, (err, data) => { // pipe file to csv parser
        if (err) return reject(err);
        // keep only last line of csv chunk
        last_line = data[data.length -1];
      })).on('end', () => { // when finished reading, create new entry
        // new entry id
        let entry_id = Number(last_line[0]) + 1;
        // return new_job;
        let writestream = fs.createWriteStream('', {
          autoClose: true,
          fd: fd // again, using fd, not path
        }).on('error', (err) => {
          return reject(err);
        });
        // create new entry
        csv.stringify([[entry_id, url]], {
          rowDelimiter: os.EOL
        }, (err, results) => {
          if (err) return reject(err);
          // write entry to log
          writestream.end(results);
          writestream.on('finish', () => {
            return resolve(entry_id);
          });
        });
      });
    });
  });
};

