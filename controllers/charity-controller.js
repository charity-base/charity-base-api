const mongoose = require('mongoose')
const aqp = require('api-query-params')
const Charity = require('../models/charity')
const { filterObject } = require('../lib/utils')
const { isDescendantOfAny } = require('../lib/query-helpers')
const log = require('../helpers/logger')

const LATEST_VERSION = 'v0.3.0';
const ALWAYS_PROJECTED = ['ids', 'name'];
const ALLOWED_FILTERS = ['ids.charityId', 'ids.GB-CHC', 'income.latest.total'];
const PRIVATE_FIELDS = [];


const hitSchema = new mongoose.Schema({
  url: String,
  countResults: Boolean,
  version: String,
  query: {
    filter: mongoose.Schema.Types.Mixed,
    projection: mongoose.Schema.Types.Mixed,
    sort: mongoose.Schema.Types.Mixed,
    limit: Number,
    skip: Number,
  },
}, {
  timestamps : true
})

const Hit = mongoose.model('Hit', hitSchema)

const stripQuery = query => {
  // Strips . and $ characters from a mongo query to allow persisting the query to a mongo doc.
  return JSON.parse(
    JSON.stringify(query).replace(/\./g, '|').replace(/\$/g, '£')
  )
}

const persistRequest = (url, query, countResults, version) => {
  const hit = new Hit({
    url: url,
    countResults,
    version,
    query: stripQuery(query),
  })

  hit.save().then(x => {
  }).catch(err => {
    log.error(err)
  })
}


const isPublic = (requestedField, privateFields) => (
  !isDescendantOfAny(requestedField, privateFields)
)

const bufferToBase64 = buffer => buffer.toString('base64')

const parseCharity = bsonCharity => {
  const jsonCharity = bsonCharity.toJSON();
  return jsonCharity
  // const faviconBuffer = bsonCharity['favicon'];
  // return faviconBuffer ? (
  //   Object.assign({}, jsonCharity, {favicon: bufferToBase64(faviconBuffer)})
  // ) : (
  //   jsonCharity
  // )
}

const checkAllProjection = query => {
  if (!query.hasOwnProperty('projection')) return query.projection = {}
  if (query.projection && query.projection.hasOwnProperty('all')) {
    query.projection = Object.keys(Charity.schema.obj).reduce((agg, x) => Object.assign({}, agg, {[x]: 1}), {})
  }
}

function validateProjection (query) {
  query.projection = query.projection || {}

  // Remove exclusions since projection cannot have a mix of inclusion and exclusion:
  query.projection = filterObject(query.projection, (key, value) => value !== 0)

  // Remove projection if it or its (grand-)parent is in PRIVATE_FIELDS:
  query.projection = filterObject(query.projection, (key, value) => isPublic(key, PRIVATE_FIELDS))

  // Do not return ID
  query.projection._id = 0;

  // Always return ALWAYS_PROJECTED
  for (let i = 0; i < ALWAYS_PROJECTED.length; i += 1) {
    query.projection[ALWAYS_PROJECTED[i]] = 1;
  }
}

function addSearchQuery (query, searchTerm) {

  if (!searchTerm) {
    return;
  }

  const search = searchTerm instanceof Array ? searchTerm[searchTerm.length - 1] : searchTerm

  // Perform AND text-search on charity name:
  var quotedWords = '"' + search.split('"').join('').split(' ').join('" "') + '"';
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
      'ids.GB-CHC' : 1,
    }
  }
}

function validateLimit(query, defaultLimit, maxLimit) {
  if (query.limit > maxLimit) {
    query.limit = maxLimit;
  } else {
    query.limit = query.limit > 0 ? query.limit : defaultLimit;
  }
}

function validateSkip(query) {
  query.skip = query.skip > -1 ? query.skip : 0;
}

const getCharities = (req, res) => {

  var query = aqp(req.query, { whitelist: ALLOWED_FILTERS });

  const countResults = req.query.hasOwnProperty('countResults')
  
  checkAllProjection(query);
  addSearchQuery(query, req.query.search);
  addDefaultSort(query);

  validateProjection(query);
  validateLimit(query, defaultLimit=10, maxLimit=50);
  validateSkip(query);

  persistRequest(req.url, query, countResults, LATEST_VERSION)

  return Promise.resolve(countResults ? (
    Charity.count(query.filter).exec()
  ) : null)
  .then(count => {
    return Promise.all([
      count,
      Charity
      .find(query.filter)
      .select(query.projection)
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit)
      .exec()
    ])
  })
  .then(([count, charities]) => {
    return res.json({
      version : LATEST_VERSION,
      totalMatches : count,
      query,
      charities,
    })
  })
  .catch(err => {
    log.error(err)
    return res.status(400).send(err);
  })
}

module.exports = getCharities;
