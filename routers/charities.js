const charitiesRouter = require('express').Router()
const log = require('../helpers/logger')
const elasticsearch = require('elasticsearch')


const getCharitiesRouter = elasticConfig => {

  const client = new elasticsearch.Client({
    host: elasticConfig.host,
  })

  charitiesRouter.get('/', (req, res, next) => {

    const { query, meta } = res.locals.elasticSearch

    const searchParams = Object.assign({}, meta, {
      index: elasticConfig.index,
      body: { query },
    })

    return client.search(searchParams, (err, response) => {
      if (err) {
        log.error(err)
        return res.status(400).send({ message: err.message })
      }
      res.json({
        version: req.params.version,
        query: searchParams,
        charities: response.hits.hits.map(x => x._source),
      })
    })
  })

  return charitiesRouter
}

module.exports = getCharitiesRouter
