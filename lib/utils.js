module.exports.filterObject = (obj, condition) => {
  // Returns filtered object of key-value pairs which yield truthy condition(key, value)

  // If condition is not a function with two arguments, return empty object
  if (typeof condition !== 'function' || condition.length !== 2) {
    return {}
  }

  return Object.keys(obj).reduce((filtered, key) => (
    condition(key, obj[key]) ? Object.assign({}, filtered, { [key] : obj[key] }) : filtered
  ), {})

  return filtered
}
