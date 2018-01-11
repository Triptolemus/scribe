const fs = require('fs');
const Storage = require('@google-cloud/storage');
const storage = new Storage();


module.exports = {
  // promise wrapper on fs.unlink
  local (filename) {
    return new Promise((resolve, reject) => {
      return fs.unlink(filename, (err) => {
        if (err) return reject(err);
        console.log('Deleted local file,', filename);
        return resolve(true);
      });
    });
  },
  // wrapper on google delete promise function
  google (bucket, filename) {
    return storage.bucket(bucket).file(filename).delete().then(() => {
      console.log('Deleted google bucket file,', filename);
      return true;
    });
  }
};
