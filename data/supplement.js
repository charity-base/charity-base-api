var mongoose = require('mongoose');
var getCharityModel = require("../models/charity.js");
var commandLineArgs = require('command-line-args');
var Case = require('case');
var streamScrapeUpdate = require('./utils/stream-scrape-update.js');

mongoose.Promise = global.Promise;

function validateOptions () {
  var options = commandLineArgs([
    { name: 'charityBaseDB', type: String, defaultValue : 'charity-base' },
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
  projectionQuery : { _id : 1, charityNumber : 1 },
  updateQueryFunc : function (entities) {
    return { '$set' : { 'scrapedEntities' : entities } };
  }
};

var scrapingOptions = {
  url : function (charity) {
    var regno = charity.charityNumber;
    return `http://example.com/?regid=${regno}&subid=0`;
  },
  extractor : function ($) {
    if (!$) return null;
    var entities = {};
    entities['field1'] = $('#field1-element-id').text();
    entities['field2'] = Case.sentence($('#field2-element-id').text(), []);
    return entities;
  },
  type : 'html'
};


var charityBaseConn = connectToDb(opts.charityBaseDB);
charityBaseConn.on("open",function(err, conn) {
  var charityBaseModel = getCharityModel(mongoose, charityBaseConn);
  streamScrapeUpdate(
    filters=dbOptions.filterQuery,
    projections=dbOptions.projectionQuery,
    urlFunc=scrapingOptions.url,
    type=scrapingOptions.type,
    extractor=scrapingOptions.extractor,
    dbUpdate=dbOptions.updateQueryFunc,
    charityBaseModel=charityBaseModel,
    bulkBatchSize=opts.bulkBatchSize,
    scrapeBatchSize=opts.scrapeBatchSize
  )()
  .catch(function(reason) {
    console.log(`Failed: ${reason}`);
    charityBaseConn.close();
  })
  .then(function() {
    charityBaseConn.close();
  });
});
