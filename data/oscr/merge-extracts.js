var mongoose = require('mongoose');
var getOscrModels = require("../../models/oscr-extract.js");
var getCharityModel = require("../../models/charity.js");
var schemaConversion = require('./../utils/oscr-schema-conversion.js');
var commandLineArgs = require('command-line-args');

mongoose.Promise = global.Promise;

function validateOptions () {
  var options = commandLineArgs([
    { name: 'oscrExtractDb', type: String, defaultValue : 'oscr-register' },
    { name: 'charityBaseDB', type: String, defaultValue : 'charity-base' },
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

function addToModel (filterQuery, ccExtractModel, charityBaseModel, update, batchSize) {

  return function () {
    var countPromise = new Promise(function(resolve, reject) {
      ccExtractModel.count(filterQuery, function(err, count) {
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

        // Warning: bulk operations do not take notice of schema options e.g. { strict : true }
        var bulk = charityBaseModel.collection.initializeOrderedBulkOp(),
            t0 = Date.now(),
            counter = 0,
            stream = ccExtractModel.find(filterQuery).lean().cursor();

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
            bulk = charityBaseModel.collection.initializeOrderedBulkOp();
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

function updateAll (oscrExtractConn, charityBaseConn, batchSize) {

  var extracts = getOscrModels(mongoose, oscrExtractConn)['v0.1'];
  var charityBaseModel = getCharityModel(mongoose, charityBaseConn);

  console.log("Starting tasks");
  var chain = Promise.resolve();

  // update the main table
  chain = chain.then(addToModel({}, extracts["oscr_register"], charityBaseModel, schemaConversion["charity"], batchSize));

  // add the financial details
  chain = chain.then(addToModel({}, extracts["oscr_register"], charityBaseModel, schemaConversion["financial"], batchSize));

  chain.then(function() {
    console.log("Finished updating charity-base successfully.");
    oscrExtractConn.close();
    charityBaseConn.close();
    return;
  });


  chain.catch(function(reason) {
    console.log("Failed to complete chain.");
    console.log(reason);
    oscrExtractConn.close();
    charityBaseConn.close();
    return;
  });

}

var options = validateOptions();

var oscrExtractConn = connectToDb(options.oscrExtractDb);
oscrExtractConn.on("open",function(err,conn) {
  var charityBaseConn = connectToDb(options.charityBaseDB);
  charityBaseConn.on("open",function(err2,conn2) {
    updateAll(oscrExtractConn, charityBaseConn, options.batchSize);
  });
});
