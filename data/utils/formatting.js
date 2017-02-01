var textFormatting = {};

textFormatting.capitalize = function (text) {
  if (text==null) {
    return null;
  }
  return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
}

textFormatting.titleCase = function (text) {
  if (text==null) {
    return null;
  }
  return text.replace(/\w\S*/g, this.capitalize);
}

textFormatting.parseDate = function (dateString) {
  if (!dateString) {
    return null;
  }
  var d = new Date(dateString);
  if (Object.prototype.toString.call(d) === "[object Date]") {
    if (isNaN(d.getTime())) {
      return null;
    }
    return d;
  }
  return null;
}

textFormatting.parseNumber = function (numberString) {
  if (numberString==null) {
    return null;
  }
  numberString = numberString.replace(/ /g, '');
  if (numberString=='') {
    return null;
  }
  var number = Number(numberString);
  if (isNaN(number)) {
    return null;
  }
  return number;
}

textFormatting.parseNegative = function (numberString) {
  var n = this.parseNumber(numberString);
  if (n==null) {
    return null;
  }
  return -Math.abs(n)
}

module.exports = textFormatting;
