module.exports.filteredObject = (obj, condition) => {
  // Returns object of key-value pairs from obj satisfying condition(key, value)

  // If condition is not a function with two arguments, return empty object.
  if (typeof condition !== 'function' || condition.length !== 2) {
    return {};
  }

  var filtered = {};
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      if (condition(k, obj[k])) {
        filtered[k] = obj[k];
      }
    }
  }
  return filtered;
}
