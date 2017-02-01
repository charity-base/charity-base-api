var mongoose = require('mongoose');
var Charity = require('../../models/charity')(mongoose);


function generateFilter (urlQuery) {

  var filter = {};

  if (urlQuery.f_charityNumber) {
    // Match specified charity number (could return multiple results if f_subNumber not specified)
    filter.charityNumber = urlQuery.f_charityNumber;
  }
  if (urlQuery.f_subNumber) {
    // Match specified subsidiary number e.g. "f_subNumber=0" to return main charities only
    // Explanation: http://apps.charitycommission.gov.uk/Showcharity/ShowCharity_Help_Page.aspx?ContentType=Help_Constituents&SelectedLanguage=English
    filter.subNumber = Number(urlQuery.f_subNumber);
  }
  if (['true', 'false'].indexOf(urlQuery.f_registered) > -1) {
    // If specified true/false, only return registered/de-registered charities respectively
    filter.registered = urlQuery.f_registered === 'true';
  }
  if (urlQuery.f_searchTerm) {
    // Perform AND text-search on charity name
    var quotedWords = urlQuery.f_searchTerm.split('"').join('').split(' ').join('" "');
    quotedWords = `"${quotedWords}"`;
    filter["$text"] = { "$search" : quotedWords };
  }
  if (urlQuery.f_$gte_income || urlQuery.f_$lt_income) {
    // Filter by charity income (lower limit inclusive, upper limit exclusive)
    filter['mainCharity.income'] = {};
    if (urlQuery.f_$gte_income) {
      filter['mainCharity.income']['$gte'] = Number(urlQuery.f_$gte_income);
    }
    if (urlQuery.f_$lt_income) {
      filter['mainCharity.income']['$lt'] = Number(urlQuery.f_$lt_income);
    }
  }

  return filter;
}


function generateProjection (urlQuery) {
  var mandatoryFields = ['charityNumber', 'subNumber', 'name', 'registered'];
  var optionalFields = ['govDoc', 'areaOfBenefit', 'mainCharity', 'contact', 'accountSubmission', 'returnSubmission', 'areaOfOperation', 'class', 'financial', 'otherNames', 'objects', 'partB', 'registration', 'trustees', 'beta'];

  var projection = {};
  projection._id = false;

  // Project mandatory fields
  for (var i=0; i<mandatoryFields.length; i++) {
    var field = mandatoryFields[i];
    projection[field] = true;
  }

  // If the user specified a search term, return the text-match strength so we can sort results
  if (urlQuery.f_searchTerm) {
    projection.score = { "$meta" : "textScore" };
  }

  // Project the optional fields specified by user with query string: "p_fieldName=true"
  for (var i=0; i<optionalFields.length; i++) {
    var field = optionalFields[i];
    var key = `p_${field}`;
    if (urlQuery[key]=='true') {
      projection[field] = true;
    }
  }

  return projection;
}


function generateSorting (urlQuery) {
  var sorting = {};
  // If the user specified a search term, sort results by text-match strength
  if (urlQuery.f_searchTerm) {
    sorting.score = { "$meta" : "textScore" };
  } else {
    sorting.charityNumber = 1;
  }
  return sorting;
}


module.exports.getCharities = function (req, res) {

  var filter = generateFilter(req.query);
  var projection = generateProjection(req.query);
  var sorting = generateSorting(req.query);

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
    .count(filter)
    .exec(function (err, count) {
      if (err) {
        return res.status(400).send({message: err});
      }
      return count;
    });
  })
  .then((count) => {
    return Charity
    .find(filter, projection)
    .sort(sorting)
    .skip((pageNumber - 1) * nPerPage)
    .limit(nPerPage)
    .exec(function (err, charities) {
      if (err) {
        return res.status(400).send({message: err});
      }
      return res.send({
        version : 'v1',
        totalMatches : count,
        pageSize : nPerPage,
        pageNumber : pageNumber,
        request : { query : req.query },
        charities : charities
      });
    });
  });

}
