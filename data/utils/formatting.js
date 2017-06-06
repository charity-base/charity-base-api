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

var padZero = function(s, n, str){
  var diff = Math.max( n-String(s).length+1, 0 );
  return Array(diff).join(str||'0')+s;
}

textFormatting.parseCharityNumber = function( ccnumber ) {
  if (typeof(ccnumber) === 'number'){
    ccnumber = (ccnumber).toString()
  }
  if (typeof(ccnumber) !== 'string') {
    return null;
  }
  ccnumber = ccnumber.replace(/ /g, '').toUpperCase().replace('O', '0');
  if( ccnumber[0] === 'S' ){
    // Scottish Charity

    // replace any non digits
    ccnumber = ccnumber.replace(/\D/g, '');

    // remove any leading zeroes
    ccnumber = ccnumber.replace(/^0+/g, '');

    // pad to 6 digits with 0
    ccnumber = padZero(ccnumber, 6, '0');

    // add 'SC' to start
    ccnumber = 'SC' + ccnumber;

    // stop at 8 chars
    ccnumber = ccnumber.slice(0,8);

  } else {
    // England and Wales charity

    // todo: split on '-' separator for subsidiary charities
    // eg charity number could be '123456-1'
    // discard remainder?

    // replace any non zero
    ccnumber = ccnumber.replace(/\D/g, '');

    // remove any leading zeroes
    ccnumber = ccnumber.replace(/^0+/g, '');

    // max of 7 chars
    ccnumber = ccnumber.slice(0,7);
  }
  if( ccnumber===''){
    return null;
  }

  return ccnumber;

}

textFormatting.parseNegative = function (numberString) {
  var n = this.parseNumber(numberString);
  if (n==null) {
    return null;
  }
  return -Math.abs(n)
}

module.exports = textFormatting;
