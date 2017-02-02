
module.exports.isAncestorProperty = function (mongoField) {
  // Given a mongo field name, return a function that will tell if another field is its ancestor (including itself)
  return function (ancestor) {
    var generations = mongoField.split('.');
    for (var i=0; i<generations.length; i++) {
      var fieldName = generations.slice(0, i+1).join('.');
      if (fieldName===ancestor) {
        return true;
      }
    }
    return false;
  }
}

module.exports.filteredObject = function (obj, condition) {
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
