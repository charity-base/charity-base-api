var fs = require('fs');
var request = require('request');
var commandLineArgs = require('command-line-args');

function validateOptions () {
  var options = commandLineArgs([
    { name: 'url', type: String, defaultValue : null },
    { name: 'out', type: String, defaultValue : './cc-register.zip' },
    { name: 'year', type: String, defaultValue : '2016' },
    { name: 'month', type: String, defaultValue : '11' }
  ]);

  return options;
}

function tDiff (tStart) {
  return Math.round((Date.now() - tStart)/1000);
}

function monthName (monthNumber) {
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthNumber-1];
}

function generateUrl (year, month) {
  if (month=='11') {
    // The CC added '_2' into the url for the re-uploaded November register.
    return 'http://apps.charitycommission.gov.uk/data/201611_2/extract1/RegPlusExtract_November_2016.zip';
  }
  return 'http://apps.charitycommission.gov.uk/data/'+year+month+'/extract1/RegPlusExtract_'+monthName(Number(month))+'_'+year+'.zip';
}

var options = validateOptions(),
    totalBytes,
    t0,
    chunked = 0,
    progress = 0,
    interval = 1;

var writeStream = fs.createWriteStream(options.out);

var fileUrl = options.url || generateUrl(options.year, options.month);
console.log("Requesting resource at " + fileUrl);

var req = request({
  method: 'GET',
  uri: fileUrl
});

req.pipe(writeStream);

req.on('response', function (data) {
  if (data.statusCode=='404') {
    console.log("Request returned status code 404.");
    console.log("Check http://data.charitycommission.gov.uk for available downloads.");
    return process.exit(1);
  }
  totalBytes = data.headers['content-length'];
  console.log("Downloading register of charities (" + totalBytes + " bytes)...");
  t0 = Date.now();
});

req.on('error', function (error) {
});

req.on('data', function (chunk) {
  chunked += chunk.length;
  if (100*chunked > progress*interval*totalBytes) {
    process.stdout.write("Downloaded " + progress*interval + "% in " + tDiff(t0) + " seconds...\r");
    progress++;
  }
});

req.on('end', function() {
  console.log('Completed download in ' + tDiff(t0) + ' seconds.');
});
