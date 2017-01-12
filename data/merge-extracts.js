var mongoose = require('mongoose');
var getCcModels = require("../models/cc-extract.js");
var getOpenModel = require("../models/charity.js");
var schemaConversion = require('./utils/schema-conversion.js');
var commandLineArgs = require('command-line-args');

mongoose.Promise = global.Promise;

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

function addToModel (filterQuery, ccExtractModel, openCharitiesModel, update, batchSize) {

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
        var bulk = openCharitiesModel.collection.initializeOrderedBulkOp(),
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


function updateAll (ccExtractConn, openCharitiesConn, batchSize) {

  var extracts = getCcModels(mongoose, ccExtractConn)['v0.1'];
  var openCharity = getOpenModel(mongoose, openCharitiesConn);

  console.log("Starting tasks");
  var chain = Promise.resolve();

  var extractsToMerge = [
    'extract_charity',
    'extract_main_charity',
    'extract_acct_submit',
    'extract_ar_submit',
    'extract_charity_aoo',
    'extract_class',
    'extract_financial',
    'extract_name',
    'extract_objects',
    'extract_partb',
    'extract_registration',
    'extract_trustee'
  ];

  for (var i=0; i<extractsToMerge.length; i++) {

    var extractName = extractsToMerge[i];
    if (!schemaConversion.hasOwnProperty(extractName)) {
      console.log(`Couldn't find conversion for ${extractName}, skipping.`)
      continue;
    }
    if (!extracts.hasOwnProperty(extractName)) {
      console.log(`Couldn't find db model for ${extractName}, skipping.`)
      continue;
    }

    var updateFunc = schemaConversion[extractName];
    var filterQuery = {}; // To select specific charities to update E.g. filterQuery = { regno : '200000' };
    chain = chain.then(addToModel(filterQuery, extracts[extractName], openCharity, updateFunc, batchSize));
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
    updateAll(ccExtractConn, openCharitiesConn, options.batchSize);
  });
});
