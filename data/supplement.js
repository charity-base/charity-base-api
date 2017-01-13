var mongoose = require('mongoose');
var getOpenModel = require("../models/charity.js");
var commandLineArgs = require('command-line-args');
var Case = require('case');
var streamScrapeUpdate = require('./utils/stream-scrape-update.js');

mongoose.Promise = global.Promise;

function validateOptions () {
  var options = commandLineArgs([
    { name: 'openCharitiesDb', type: String, defaultValue : 'open-charities' },
    { name: 'scrapeBatchSize', type: Number, defaultValue : 80 },
    { name: 'bulkBatchSize', type: Number, defaultValue : 800 }
  ]);

  if (options.bulkBatchSize%options.scrapeBatchSize!=0) {
    console.log("Error: bulkBatchSize must be a multiple of scrapeBatchSize");
    return process.exit();
  }

  return options;
}

function connectToDb (dbName) {
  return mongoose.createConnection(`mongodb://localhost:27017/${dbName}`, {config: { autoIndex: true }});
}

var opts = validateOptions();


var dbOptions = {
  filterQuery : { registered : true, subNumber : 0, scrapedEntities : { $exists : false } },
  projectionQuery : { _id : true, charityNumber : true },
  updateQueryFunc : function (entities) {
    return { '$set' : { 'scrapedEntities' : entities } };
  }
};


var scrapingOptions = {
  url : function (charity) {
    var regno = charity.charityNumber;
    return 'http://example.com/?regid=${regno}&subid=0'
  },
  extractor : function ($) {
    var entities = {};
    entities['field1'] = $('#field1-element-id').text();
    entities['field2'] = Case.sentence($('#field2-element-id').text(), []);
    return entities;
  }
};

var openCharitiesConn = connectToDb(opts.openCharitiesDb);
openCharitiesConn.on("open",function(err, conn) {
  var openCharity = getOpenModel(mongoose, openCharitiesConn);
  streamScrapeUpdate(
    filters=dbOptions.filterQuery,
    projections=dbOptions.projectionQuery,
    urlFunc=scrapingOptions.url,
    extractor=scrapingOptions.extractor,
    dbUpdate=dbOptions.updateQueryFunc,
    openCharitiesModel=openCharity,
    bulkBatchSize=opts.bulkBatchSize,
    scrapeBatchSize=opts.scrapeBatchSize
  )()
  .catch(function(reason) {
    console.log(`Failed: ${reason}`);
    openCharitiesConn.close();
  })
  .then(function() {
    openCharitiesConn.close();
  });
});
