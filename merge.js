
const max_checks = 5;
const max_attempts = 5;

// output array of suggested words, merging words between the master and helper
// works better with longer strings
module.exports = function (master, helper) {
  // container for merged words
  let merge_array = [];

  // get match, send to merged array, then recurse
  let match = function (master, helper) {
    if (master.length === 0 && helper.length === 0) {
      // break loop if we are done matching

      return merge_array.join(' ');
    }
    let chunk = test(master, helper, 1, 1);
    if (chunk === false) {
      // matching failed, just get the master string
      return master;
    } else {
      merge(master.slice(0, chunk.check), helper.slice(0, chunk.attempt));
      return match(master.slice(chunk.check), helper.slice(chunk.attempt));
    }
  };

  // returns first match that allows reasonable downstream matching
  // or end of string reached,
  // or returns FALSE for failure to find reasonable matching
  let test = function (master, helper, check, attempt) {
    // if you've taken too many attempts to match a word, then fail the chain
    if (attempt > max_attempts) {
      return false;
    } else if (attempt > helper.length) { // if you're past end of helper
      // report the check and attempt as if it were successful match
      return {check: check, attempt: attempt};
    } else if (check > max_checks) { // if you've had too many helper checks
      // recurse to next attempt to match helper word
      return test(master, helper, 1, attempt + 1);
    } else if (master[check - 1] === helper[attempt - 1]) { // check for a match
      // check that downstream matching is acceptable
      if (test(master.slice(check), helper.slice(attempt), 1, 1)) {
        // report the position of the match if acceptable
        return {check: check, attempt: attempt};
      } else { // if not
        // recurse with check on next word in master
        return test(master, helper, check + 1, attempt);
      }
    } else { // if no match
      // then recurse with check on next word in master
      return test(master, helper, check + 1, attempt);
    }
  };

  let merge = function (chunk1, chunk2) {
    // create entry to add - if chunks are different, then format both
    let entry = (chunk1.join(' ') === chunk2.join(' ')) ?
      chunk1.join(' ') :
      '(' + chunk1.join(' ') + ')/(' + chunk2.join(' ') + ')';
    merge_array.push(entry);
  };

  // execute the matching from the beginning!
  return match(master.split(' '), helper.split(' '));
};

