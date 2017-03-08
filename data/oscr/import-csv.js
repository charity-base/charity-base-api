var fs = require('fs');
var AdmZip = require('adm-zip');
var mongoose = require('mongoose');
var oscrModel = require("../../models/oscr-extract.js")(mongoose);
var commandLineArgs = require('command-line-args');


function validateOptions () {
  var options = commandLineArgs([
    { name: 'in', type: String, defaultValue : './CharityExport-07-Feb-2017.zip' },
    { name: 'out', type: String, defaultValue : './oscr-register-csv' },
  ]);

  if (!fs.existsSync(options.in) || options.in.substr(-4)!='.zip') {
    console.log("Exiting because couldn't find .zip file at '" + options.in + "'");
    return process.exit(1);
  }
  if (fs.existsSync(options.out)) {
    console.log("Exiting to avoid overwriting files in '" + options.out + "'");
    console.log("Please remove the directory or specify another (non-existent) one with the --out option.");
    return process.exit(1);
  }

  return options;
}


function writeCSV (unzip, writeDir, sourceFilename) {
  return function() {
    return new Promise(function(resolve, reject) {
      try {
        var filePath = [writeDir, sourceFilename].join('/');
        console.log(`Unzipping ${filePath}`);
        unzip(sourceFilename, writeDir); // sync
      } catch (err) {
        console.log("Failed to unzip " + sourceFilename);
        return reject(err);
      }
      return resolve(filePath);
    });
  }
}

// main script
var options = validateOptions(),
    writeDir = options.out,
    zip = new AdmZip(options.in),
    unzip = zip.extractEntryTo,
    chain = Promise.resolve();

zip.getEntries().forEach(function(zipEntry) {
  chain = chain.then(writeCSV(unzip, writeDir, zipEntry.entryName));
})

chain.then(function() {
  console.log(`Finished writing CSVs to ${writeDir}`);
});

chain.catch(function(reason) {
  console.log("Failed to complete chain.");
  console.log(reason);
});
