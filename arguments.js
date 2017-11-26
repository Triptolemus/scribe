module.exports = {
  parse_args: function () {
    let args = process.argv;
    if (args.length < 3) {
      throw new Error('Missing argument for URL');
    } else if (args.length > 3) {
      throw new Error('Too many arguments passed to function');
    }
    return args[2];
  }
};
