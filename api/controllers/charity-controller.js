var mongoose = require('mongoose');
var Charity = require('../../models/charity')(mongoose);
var aqp = require('api-query-params');
var {filteredObject, isAncestorProperty} = require('../helpers/index');

var latestVersion = 'v0.1.0';


function customiseProjection (projection) {

  var custom = projection || {};

  var privateFields = [];
  var compulsoryFields = ['charityNumber', 'subNumber', 'registered', 'name'];

  // Remove exclusions since projection cannot have a mix of inclusion and exclusion:
  var custom = filteredObject(custom, (key, value) => value===1);

  // Remove projection if it or its (grand-)parent is in privateFields:
  var custom = filteredObject(custom, (key, value) => !privateFields.some(isAncestorProperty(key)));

  // Do not return ID
  custom._id = 0;
  // Always return compulsoryFields
  for (var i=0; i<compulsoryFields.length; i++) {
    custom[compulsoryFields[i]] = 1;
  }

  return custom;
}


function addSearchQuery (query, searchTerm) {
  if (!searchTerm) {
    return;
  }

  // Perform AND text-search on charity name:
  var quotedWords = '"' + searchTerm.split('"').join('').split(' ').join('" "') + '"';
  query.filter["$text"] = { "$search" : quotedWords };
  // Project text-match score:
  query.projection.score = { "$meta" : "textScore" };
  // If no sorting specified, sort by score:
  if (!query.sort) {
    query.sort = {
      score : { "$meta" : "textScore" }
    };
  }
}


function addDefaultSort (query) {
  if (!query.sort) {
    query.sort = {
      charityNumber : 1,
      subNumber: 1
    };
  }
}


module.exports.getCharities = function (req, res) {

  if (req.params.version!==latestVersion) {
    return res.status(400).send({
      message: `You requested version ${req.params.version} but only the latest version ${latestVersion} is supported`
    });
  }

  var query = aqp.default(req.query, {
    // whitelist only allows filters on these fields (not including their children)
    whitelist: ['charityNumber', 'subNumber', 'registered', 'mainCharity.income']
  });
  // Note: the following accepted query parameters are not processed by aqp: ['search', 'l_pageNumber', 'countResults']

  query.projection = customiseProjection(query.projection);

  addSearchQuery(query, req.query.search);

  addDefaultSort(query);


  var nPerPage = 10;
  var pageNumber = Number(req.query.l_pageNumber);
  var pageNumber = pageNumber>0 ? pageNumber : 1;

  return Promise.resolve(
    req.query.hasOwnProperty('countResults')
  )
  .then((countResults) => {
    if (!countResults) {
      return null;
    }
    return Charity
    .count(query.filter)
    .exec(function (err, count) {
      if (err) {
        return res.status(400).send({message: err});
      }
      return count;
    });
  })
  .then((count) => {
    return Charity
    .find(query.filter)
    .select(query.projection)
    .sort(query.sort)
    .skip((pageNumber - 1) * nPerPage)
    .limit(nPerPage)
    .exec(function (err, charities) {
      if (err) {
        return res.status(400).send({message: err});
      }
      return res.send({
        version : latestVersion,
        totalMatches : count,
        pageSize : nPerPage,
        pageNumber : pageNumber,
        query : {
          filter : query.filter,
          projection : query.projection,
          sort : query.sort,
          skip : (pageNumber - 1) * nPerPage,
          limit : nPerPage
        },
        charities : charities
      });
    });
  });

}
