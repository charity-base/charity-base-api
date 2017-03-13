var rp = require('request-promise');
var cheerio = require('cheerio');
var errors = require('request-promise/errors');

function tDiff (tStart) {
  return Math.round((Date.now() - tStart)/1000);
}

function increment (obj, key) {
  if (!obj.hasOwnProperty(key)) {
    obj[key] = 0;
  }
  obj[key] += 1;
}

function countKeys (obj) {
  var total = 0;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var v = Number(obj[key]);
      if (v) {
        total += v;
      }
    }
  }
  return total;
}

var scrapeOne = function(url, type, extractor, errorCounts, responseTimeout) {
  return rp({
    uri: url,
    timeout: responseTimeout,
    encoding: type==='binary' ? null : undefined,
    transform: function (body) {
      if (type==='html') return cheerio.load(body);
      if (type==='json') return JSON.parse(body);
      return body;
    }
  })
  .catch(errors.TransformError, function (reason) {
    increment(errorCounts, 'bodyTransform');
    return null;
  })
  .catch(errors.StatusCodeError, function (reason) {
    increment(errorCounts, 'statusCode');
    return null;
  })
  .catch(function (reason) {
    // Common codes are: ECONNRESET , ESOCKETTIMEDOUT , ETIMEDOUT
    if (reason.error && reason.error.code) {
      increment(errorCounts, reason.error.code);
    } else {
      increment(errorCounts, 'unknown');
    }
    return null;
  })
  .then(function ($) {
    return extractor($);
  })
  .catch(function (reason) {
    increment(errorCounts, 'extractor');
    return null;
  });
}

function scrapeBatch (charities, urlFunc, type, extractor, dbUpdate, bulk, errorCounts) {
  var requestArray = [];
  for (var i=0; i<charities.length; i++) {
    var url = urlFunc(charities[i]);
    requestArray.push(scrapeOne(url, type, extractor, errorCounts, 4000));
  }
  return Promise.all(requestArray).then(function(values) {
    for (var i=0; i<charities.length; i++) {
      bulk.find({ _id : charities[i]._id }).updateOne(dbUpdate(values[i]));
    }
    return;
  });
}

function streamScrapeUpdate (filters, projections, urlFunc, type, extractor, dbUpdate, charityBaseModel, bulkBatchSize, scrapeBatchSize) {

  return function () {
    var countPromise = new Promise(function(resolve, reject) {
      charityBaseModel.count(filters, function(err, count) {
        if (err) {
          console.log("Error counting documents.");
          reject(err);
        }
        console.log(`Reading ${count} records from '${charityBaseModel.collection.collectionName}' collection`);
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
            charities = [],
            errorCounts = {},
            t0 = Date.now(),
            t,
            counter = 0,
            stream = charityBaseModel.find(filters, projections).lean().cursor();

        stream.on("data", function(doc) {
          counter ++;

          charities.push(doc);

          if (counter%scrapeBatchSize==0 || counter==totalCount) {
            stream.pause();
            var scrapePromise = scrapeBatch(charities, urlFunc, type, extractor, dbUpdate, bulk, errorCounts);
            scrapePromise.catch(function(reason) {
              console.log(`Batch scraping error`);
              return reject(reason);
            })
            
            scrapePromise.then(function() {
              charities = [];
              if (counter%bulkBatchSize!=0 && counter!=totalCount) {
                return stream.resume();
              }

              bulk.execute(function(err,result) {
                if (err) {
                  console.log("Bulk operation error.");
                  return reject(err);
                }
                t = tDiff(t0);
                var percentError = Math.round(100 * countKeys(errorCounts) / counter);
                var tRemaining = Math.round(t * (totalCount - counter) / counter / 60);
                var avgRate = Math.round(counter/t);
                console.log(`Scraped ${counter} pages in ${t} seconds with ${percentError}% error rate. Avg ${avgRate} pgs/sec. ${Math.round(t/60)} mins elapsed, ${tRemaining} mins remaining.`);
                console.log(`Error causes: ${JSON.stringify(errorCounts)}`);
                bulk = charityBaseModel.collection.initializeOrderedBulkOp();
                if (counter==totalCount) {
                  console.log(`Persisted ${counter} records in ${t} seconds.`);
                  return resolve();
                }
                return stream.resume();
              });
            });

          }

        });

        stream.on("error", function(error) {
          console.log("Error reading data.");
          return reject(error);
        });

      });
    });
  }
}

module.exports = streamScrapeUpdate;
