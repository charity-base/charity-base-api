var mongoose = require('mongoose');
var getCcModels = require("./models/cc-extract.js");
var getOpenModel = require("./models/charity.js");
var schemaConversion = require('./models/schema-conversion');
var commandLineArgs = require('command-line-args');

function validateOptions () {
  var options = commandLineArgs([
    { name: 'ccExtractDb', type: String, defaultValue : 'cc-register' },
    { name: 'openCharitiesDb', type: String, defaultValue : 'open-charities' },
    { name: 'batchSize', type: Number, defaultValue : 10000 }
  ]);

  return options;
}

function tDiff (tStart) {
  return Math.round((Date.now() - tStart)/1000);
}

function connectToDb (dbName) {
  return mongoose.createConnection(`mongodb://localhost:27017/${dbName}`, {config: { autoIndex: true }});
}

function addToModel (ccExtractModel, openCharitiesModel, update, batchSize) {

  return function () {

    var countPromise = new Promise(function(resolve, reject) {
      ccExtractModel.count({}, function(err, count) {
        if (err) {
          console.log("Error counting documents.");
          reject(err);
        }
        console.log(`Reading ${count} records from '${ccExtractModel.collection.collectionName}' collection`);
        resolve(count);
      });
    });

    return countPromise.then(function(totalCount) {
      return new Promise(function(resolve, reject) {

        if (totalCount==0) {
          return resolve();
        }

        var bulk = openCharitiesModel.collection.initializeOrderedBulkOp(),
            t0 = Date.now(),
            counter = 0,
            stream = ccExtractModel.find().lean().cursor();

        stream.on("data", function(doc) {
          counter ++;

          if (counter%batchSize==0) {
            stream.pause();
          }

          update(doc, bulk);

          if (counter%batchSize!=0 && counter!=totalCount) {
            return;
          }

          bulk.execute(function(err,result) {
            if (err) {
              console.log("Bulk operation error.");
              return reject(err);
            }
            process.stdout.write("Persisted " + counter + " records in " + tDiff(t0) + " seconds.\r");
            bulk = openCharitiesModel.collection.initializeOrderedBulkOp();
            if (counter==totalCount) {
              console.log("Persisted " + counter + " records in " + tDiff(t0) + " seconds.");
              return resolve();
            }
            return stream.resume();
          });
        });

        stream.on("error", function(error) {
          console.log("Error reading data.");
          return reject(error);
        });

      });
    });
  }
}


function updateAll (insert, ccExtractConn, openCharitiesConn, batchSize) {

  var extracts = getCcModels(mongoose, ccExtractConn)['v0.1'];
  var openCharity = getOpenModel(mongoose, openCharitiesConn);

  console.log("Starting tasks");
  var chain = Promise.resolve();

  if (insert) {
    chain = chain.then(addToModel(extracts.extract_charity, openCharity, schemaConversion.extract_charity, batchSize));
  }

  for (var extractName in schemaConversion) {

    if (!schemaConversion.hasOwnProperty(extractName)) {
      continue;
    }
    if (!extracts.hasOwnProperty(extractName)) {
      console.log(`Couldn't find model for ${extractName}, skipping.`)
      continue;
    }
    if (extractName=='extract_charity') {
      continue;
    }

    var updateFunc = schemaConversion[extractName];
    chain = chain.then(addToModel(extracts[extractName], openCharity, updateFunc, batchSize));
  }

  chain.then(function() {
    console.log("Finished updating open-charities successfully.");
    ccExtractConn.close();
    openCharitiesConn.close();
    return;
  });

  chain.catch(function(reason) {
    console.log("Failed to complete chain.");
    console.log(reason);
    ccExtractConn.close();
    openCharitiesConn.close();
    return;
  });

}

var options = validateOptions();

var ccExtractConn = connectToDb(options.ccExtractDb);
ccExtractConn.on("open",function(err,conn) {
  var openCharitiesConn = connectToDb(options.openCharitiesDb);
  openCharitiesConn.on("open",function(err2,conn2) {
    updateAll(true, ccExtractConn, openCharitiesConn, options.batchSize);
  });
});
