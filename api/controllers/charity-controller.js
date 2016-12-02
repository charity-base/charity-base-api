var mongoose = require('mongoose');
var Charity = require('../../models/charity')(mongoose);


function generateFilter (urlQuery) {

  var filter = {};

  if (urlQuery.f_charityNumber) {
    filter.charityNumber = Number(urlQuery.f_charityNumber);
  }
  if (urlQuery.f_subNumber) {
    filter.subNumber = Number(urlQuery.f_subNumber);
  }
  if (urlQuery.f_registeredOnly=='true') {
    filter.registered = true;
  }
  if (urlQuery.f_searchTerm) {
    var quotedWords = urlQuery.f_searchTerm.split('"').join('').split(' ').join('" "');
    quotedWords = `"${quotedWords}"`;
    filter["$text"] = { "$search" : quotedWords };
  }

  return filter;
}


function generateProjection (urlQuery) {
  var optionalFields = ['govDoc', 'areaOfBenefit', 'mainCharity', 'contact', 'accountSubmission', 'returnSubmission', 'areaOfOperation', 'class', 'financial', 'otherNames', 'objects', 'partB', 'registration', 'trustees'];

  var projection = {};
  projection._id = false;

  if (urlQuery.f_searchTerm) {
    projection.score = { "$meta" : "textScore" };
  }

  for (var i=0; i<optionalFields.length; i++) {
    var field = optionalFields[i];
    var key = `p_${field}`;
    if (urlQuery[key]!='true') {
      projection[field] = false;
    }
  }

  return projection;
}


function generateSorting (urlQuery) {
  var sorting = {};
  if (urlQuery.f_searchTerm) {
    sorting.score = { "$meta" : "textScore" };
  }
  return sorting;
}


module.exports.getCharities = function (req, res) {

  var filter = generateFilter(req.query);
  var projection = generateProjection(req.query);
  var sorting = generateSorting(req.query);

  var nPerPage = 10;
  var pageNumber = req.query.l_pageNumber>0 ? req.query.l_pageNumber : 1;

  Charity.count(filter).exec(function (err1, count) {
    if (err1) {
      return res.status(400).send({message: err1});
    }
    Charity.find(filter, projection).sort(sorting).skip((pageNumber-1)*nPerPage).limit(nPerPage).exec(function (err2, charities) {
      if (err2) {
        return res.status(400).send({message: err2});
      }
      return res.send({count: count, charities: charities});
    });
  });

}
