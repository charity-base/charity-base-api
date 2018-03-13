const aqp = require('api-query-params')
const Charity = require('../models/charity')
const { filterObject } = require('../lib/utils')
const { isDescendantOfAny } = require('../lib/query-helpers')

const ALWAYS_PROJECTED = ['ids', 'name']
const ALLOWED_FILTERS = ['ids.charityId', 'ids.GB-CHC', 'income.latest.total']
const PRIVATE_FIELDS = []

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

const getQuery = (req, res, next) => {
  const query = aqp(req.query, { whitelist: ALLOWED_FILTERS })
  
  checkAllProjection(query)
  addSearchQuery(query, req.query.search)
  addDefaultSort(query)

  validateProjection(query)
  validateLimit(query, defaultLimit=10, maxLimit=50)
  validateSkip(query)

  res.locals.query = query
  return next()
}

module.exports = getQuery
