const aggByTerm = require('./aggByTerm')
const AGG_NAME = 'agg_area'
const ES_FIELD = 'areas.id'
const NUM_VALUES = 500

const aggAreas = aggByTerm(AGG_NAME, ES_FIELD, NUM_VALUES)

module.exports = aggAreas
