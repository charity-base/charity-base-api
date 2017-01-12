var fs = require('fs');
var csv = require("fast-csv");
var mongoose = require('mongoose');
var ccModels = require("../models/cc-extract.js")(mongoose);
var commandLineArgs = require('command-line-args');

mongoose.Promise = global.Promise;

function validateOptions () {
  var options = commandLineArgs([
    { name: 'in', type: String, defaultValue : './cc-register-csvs' },
    { name: 'dbName', type: String, defaultValue : 'cc-register' },
    { name: 'batchSize', type: Number, defaultValue : 10000 }
  ]);

  return options;
}

function tDiff (tStart) {
  return Math.round((Date.now() - tStart)/1000);
}

function connectToDb (dbName) {
  mongoose.connect("mongodb://localhost:27017/"+dbName, {config: { autoIndex: true }});
  return mongoose.connection;
}

function rowToObj (row, schemaObj) {
  // WARNING: assumes object key order is preserved
  var i = 0,
      obj = {};    
  for (var key in schemaObj) {
    if (schemaObj.hasOwnProperty(key)) {
      obj[key] = row[i];
      i++;
    }
  }
  return obj;
}

function mongoImport (filePath, Model, batchSize) {

  return function () {
    return new Promise(function(resolve, reject) {

      var collectionName = Model.collection.collectionName,
          bulk = Model.collection.initializeOrderedBulkOp(),
          stream = csv.fromPath(filePath, {trim: true}),
          t0 = Date.now(),
          counter=0;

      stream.on("data", function(row) {

        if (row.length==0) {return;}

        counter ++;

        stream.pause();
        var doc = rowToObj(row, Model.schema.obj);
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

function loadData (dataDirectory, dbConnection, batchSize) {
  dbConnection.on("open",function(err,conn) {
    fs.readdir(dataDirectory, function (readErr, files) {

      console.log("Loading " + files.length + " files in " + dataDirectory + " to '" + dbConnection.name + "' database.")
      
      var chain = Promise.resolve();
      files.forEach(function(fileName) {

        var filePath = [dataDirectory, fileName].join('/');
        var collectionName = fileName.substr(0, fileName.length-4);

        var Model = ccModels['v0.1'][collectionName];

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
    batchSize = options.batchSize;

loadData(csvDataDir, dbConnection, batchSize);
