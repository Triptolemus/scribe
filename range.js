// very simple range array generator
module.exports = function (start, stop, step) {
  let range = [];
  for (let i = start; i < stop; i = i + step) {
    range.push(i);
  }
  return range;
}
