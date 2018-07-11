const aggregateCharitiesRouter = require('express').Router()
const parseElasticSearchAggs = require('../middlewares/parse-query/aggregate')
const log = require('../helpers/logger')
const elasticsearch = require('elasticsearch')

const getAggregateCharitiesRouter = elasticConfig => {

  const client = new elasticsearch.Client({
    host: elasticConfig.host,
  })

  aggregateCharitiesRouter.use(parseElasticSearchAggs())

  aggregateCharitiesRouter.get('/', (req, res, next) => {

    const searchParams = {
      index: elasticConfig.index,
      size: 0,
      body: {
        query: res.locals.elasticSearch.query,
        aggs: res.locals.elasticSearchAggs,
      },
    }

    return client.search(searchParams, (err, response) => {
      if (err) {
        log.error(err)
        return res.status(400).send({ message: err.message })
      }

      res.json({
        version: req.params.version,
        query: searchParams,
        aggregations: response.aggregations,
      })
    })
  })

  return aggregateCharitiesRouter
}

module.exports = getAggregateCharitiesRouter
