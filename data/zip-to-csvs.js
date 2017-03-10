var fs = require('fs');
var AdmZip = require('adm-zip');
var commandLineArgs = require('command-line-args');
var exec = require('child_process').exec;


function validateOptions () {
  var options = commandLineArgs([
    { name: 'in', type: String, defaultValue : './cc-register.zip' },
    { name: 'out', type: String, defaultValue : './cc-register-csvs' },
    { name: 'type', type: String, defaultValue : 'cc' }
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
  if (['cc', 'oscr'].indexOf(options.type) < 0) {
    console.log("Error: option --type must be one of 'cc' or 'oscr'");
    return process.exit(1);
  }

  return options;
}

function removeHeader () {
  return [
    {match: '.', replace: '', message: "Removing header", condition: "if $.==1"},
    {match: '\\n', replace: '', message: "Removing new line", condition: "if $.==1"}
  ]
}

function bcpReplacements () {
  // The order of these tasks is important
  // e.g. important to replace col delims before row delims since empty fields look like @**@@**@ (which contains *@@*)
  return [
    {match: ' +', replace: ' ', message: "Removing whitespace"},
    {match: '\\t', replace: ' ', message: "Removing tabs"},
    {match: '\\n', replace: ' ', message: "Removing newlines"},
    {match: '\\x0', replace: '', message: "Removing null characters"},
    {match: '"', replace: '""', message: "Escaping quotations"},
    {match: '@\\*\\*@', replace: '","', message: "Replacing column delimiters"},
    {match: '\\*@@\\*', replace: '"\\n"', message: "Replacing row delimiters"},
    {match: '^', replace: '"', message: "Inserting quote at start", condition: "if $.==1"},
    {match: '"$', replace: '\\n', message: "Removing quote from end", condition: "if eof"}
  ];
}


function unzipFile (unzip, writeDir, sourceFilename) {
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


function findAndReplace (match, replace, condition, message) {
  return function (fileName) {
    var padding = Array(50).join('.').substr(message.length);
    process.stdout.write(`${message}${padding}\r`);
    return new Promise(function(resolve, reject) {
      // Perl has similar syntax to GNU sed and is consistent across operating systems:
      var command = `perl -i -pe 's/${match}/${replace}/g ${condition||""}' ${fileName}`;
      exec(command, function (error, stdout, stderr) {
        if (error) {
          console.error(`Execution error: ${error}`);
          return reject(error);
        }
        resolve(fileName);
      });
    });
  }
}


function amendExtension () {
  return function (bcpFileName) {
    return new Promise(function(resolve, reject) {
      var csvFileName = bcpFileName.substr(0, bcpFileName.length-4) + '.csv';
      fs.rename(bcpFileName, csvFileName, function(error) {
        if (error) {
          console.log(`Error renaming ${bcpFileName} to ${csvFileName}`);
          return reject(error);
        }
        console.log(`Finished generating ${csvFileName}`);
        return resolve(csvFileName);
      });
    });
  }
}


var options = validateOptions(),
    writeDir = options.out,
    zip = new AdmZip(options.in),
    unzip = zip.extractEntryTo,
    tasks = options.type==='cc' ? bcpReplacements() : removeHeader(),
    chain = Promise.resolve();

zip.getEntries().forEach(function(zipEntry) {
  chain = chain.then(unzipFile(unzip, writeDir, zipEntry.entryName));
  for (var i=0; i<tasks.length; i++) {
    var t = tasks[i];
    chain = chain.then(findAndReplace(t.match, t.replace, t.condition, t.message));
  }
  chain = chain.then(amendExtension());
})

chain.then(function() {
  console.log(`Finished writing CSVs to ${writeDir}`);
});
chain.catch(function(reason) {
  console.log("Failed to complete chain.");
  console.log(reason);
});
