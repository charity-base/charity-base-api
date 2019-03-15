const aggByTerm = require('./aggByTerm')
const AGG_NAME = 'areas'
const ES_FIELD = 'areasOfOperation.id'
const NUM_VALUES = 500

const aggAreas = aggByTerm(AGG_NAME, ES_FIELD, NUM_VALUES)

module.exports = aggAreas
