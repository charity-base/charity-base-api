var mongoose = require('mongoose');
var Charity = require('../../data/models/charity')(mongoose);


module.exports.getCharities = function (req, res) {

  var filter = {},
      projection = {},
      sort = {};

  projection._id = false;

  var projFields = ['govDoc', 'areaOfBenefit', 'mainCharity', 'contact', 'accountSubmission', 'returnSubmission', 'areaOfOperation', 'class', 'financial', 'otherNames', 'objects', 'partB', 'registration', 'trustees'];
  for (var i=0; i<projFields.length; i++) {
    var key = 'p_'+projFields[i];
    if (req.query[key]!='true') {
      projection[projFields[i]] = false;
    }
  }

  if (req.query.hasOwnProperty('f_charityNumber')) {
    filter.charityNumber = Number(req.query.f_charityNumber);
  }
  if (req.query.hasOwnProperty('f_subNumber')) {
    filter.subNumber = Number(req.query.f_subNumber);
  }
  if (req.query.f_registeredOnly=='true') {
    filter.registered = true;
  }
  if (req.query.f_searchTerm) {
    var quotedWords = req.query.f_searchTerm.split('"').join('').split(' ').join('" "');
    quotedWords = '"' + quotedWords + '"';
    filter["$text"] = { "$search" : quotedWords };
    projection["score"] =  { "$meta" : "textScore" };
    sort["score"] = { "$meta" : "textScore" };
  }

  var nPerPage = 10;
  var pageNumber = req.query.l_pageNumber>0 ? req.query.l_pageNumber : 1;

  Charity.count(filter).exec(function (err1, count) {
    if (err1) {
      return res.status(400).send({message: err1});
    }
    Charity.find(filter, projection).sort(sort).skip((pageNumber-1)*nPerPage).limit(nPerPage).exec(function (err2, charities) {
      if (err2) {
        return res.status(400).send({message: err2});
      }
      return res.send({count: count, charities: charities});
    });
  });

}