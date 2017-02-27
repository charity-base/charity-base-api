var fs = require('fs');
var csv = require("fast-csv");
var mongoose = require('mongoose');
var oscrModel = require("../../models/oscr-extract.js")(mongoose);
var commandLineArgs = require('command-line-args');

function validateOptions () {
  var options = commandLineArgs([
    { name: 'in', type: String, defaultValue : './oscr-register-csv' },
    { name: 'dbName', type: String, defaultValue : 'oscr-register' },
    { name: 'batchSize', type: Number, defaultValue : 10000 }
  ]);

  if (!fs.existsSync(options.in)) {
    console.log("Exiting because couldn't find directory at '" + options.in + "'");
    return process.exit(1);
  }

  return options;
}


// Import into Database

// @todo duplicated with csvs-to-mongo.js - maybe move to separate file

function tDiff (tStart) {
  return Math.round((Date.now() - tStart)/1000);
}

function connectToDb (dbName) {
  mongoose.connect("mongodb://localhost:27017/"+dbName, {config: { autoIndex: true }});
  return mongoose.connection;
}

// @todo duplicated with csvs-to-mongo.js - maybe move to separate file
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

        var Model = oscrModel['v0.1']['oscr_register'];

        chain = chain.then(mongoImport(filePath, Model, batchSize));
      });

      chain.then(function() {
        console.log("Add financial records to financial table.");
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


// main script
var options = validateOptions(),
    writeDir = options.in,
    dbConnection = connectToDb(options.dbName),
    chain = Promise.resolve();

chain.then(loadData(writeDir, dbConnection, options.batchSize));

chain.then(function() {
  console.log(`Finished importing to mongo`);
});

chain.catch(function(reason) {
  console.log("Failed to complete chain.");
  console.log(reason);
});
