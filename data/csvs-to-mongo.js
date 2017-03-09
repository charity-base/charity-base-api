var fs = require('fs');
var csv = require("fast-csv");
var mongoose = require('mongoose');
var commandLineArgs = require('command-line-args');

mongoose.Promise = global.Promise;

function validateOptions () {
  var options = commandLineArgs([
    { name: 'in', type: String, defaultValue : './cc-register-csvs/RegPlusExtract_January_2017' },
    { name: 'dbName', type: String, defaultValue : 'cc-register' },
    { name: 'type', type: String, defaultValue : 'cc' },
    { name: 'batchSize', type: Number, defaultValue : 10000 }
  ]);

  if (!fs.existsSync(options.in)) {
    console.log(`Error: couldn't find directory '${options.in}'`);
    return process.exit(1);
  }

  if (['cc', 'oscr'].indexOf(options.type) < 0) {
    console.log("Error: option --type must be one of 'cc' or 'oscr'");
    return process.exit(1);
  }

  return options;
}

function tDiff (tStart) {
  return Math.round((Date.now() - tStart)/1000);
}

function connectToDb (dbName) {
  mongoose.connect("mongodb://localhost:27017/"+dbName, {config: { autoIndex: true }});
  return mongoose.connection;
}

function getModels (type) {
  return require(`../models/${type==='cc' ? 'cc-extract.js' : 'oscr-extract.js'}`)(mongoose);
}

function mongoImport (filePath, Model, batchSize) {

  return function () {
    return new Promise(function(resolve, reject) {

      var collectionName = Model.collection.collectionName,
          bulk = Model.collection.initializeOrderedBulkOp(),
          stream = csv.fromPath(filePath, {trim: true, headers: Object.keys(Model.schema.obj)}),
          t0 = Date.now(),
          counter=0;

      stream.on("data", function(doc) {

        if (Object.keys(doc).length === 0) return;

        counter ++;

        stream.pause();
        bulk.insert(doc);

        if (counter%batchSize!=0) {
          return stream.resume();
        }

        bulk.execute(function(err,result) {
          process.stdout.write("Persisted " + counter + " docs to collection '" + collectionName + "' in " + tDiff(t0) + " seconds.\r");
          bulk = Model.collection.initializeOrderedBulkOp();
          return stream.resume();
        });

      });

      stream.on("end",function() {

        if (counter%batchSize!=0) {
          bulk.execute(function(err,result) {
            console.log("Persisted " + counter + " docs to collection '" + collectionName + "' in " + tDiff(t0) + " seconds.");
            resolve();
          });
        }

      });
    });
  }
}

function loadData (dataDirectory, dbConnection, models, type, batchSize) {
  dbConnection.on("open",function(err,conn) {
    fs.readdir(dataDirectory, function (readErr, files) {

      console.log("Loading " + files.length + " files in " + dataDirectory + " to '" + dbConnection.name + "' database.")
      
      var chain = Promise.resolve();
      files.forEach(function(fileName) {

        var filePath = [dataDirectory, fileName].join('/');

        var collectionName = type==='cc'
          ? fileName.substr(0, fileName.length-4)
          : 'oscr_register';

        var Model = models[collectionName];

        chain = chain.then(mongoImport(filePath, Model, batchSize));
      });

      chain.then(function() {
        console.log("Finished persisting to db.");
        return dbConnection.close();
      });

      chain.catch(function(reason) {
        console.log("Failed to complete chain.");
        console.log(reason);
      });

    });
  });
}


var options = validateOptions();

var dbConnection = connectToDb(options.dbName),
    csvDataDir = options.in,
    batchSize = options.batchSize,
    models = getModels(options.type)['v0.1'];

loadData(csvDataDir, dbConnection, models, options.type, batchSize);
