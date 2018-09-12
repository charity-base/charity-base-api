const charitiesRouter = require('express').Router()
const log = require('../helpers/logger')


const getCharitiesRouter = (esClient, esIndex) => {

  charitiesRouter.get('/', (req, res, next) => {

    const { query, meta } = res.locals.elasticSearch

    const searchParams = Object.assign({}, meta, {
      index: esIndex,
      body: { query },
    })

    return esClient.search(searchParams, (err, response) => {
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
