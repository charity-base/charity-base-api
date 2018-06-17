const charitiesRouter = require('express').Router()
const log = require('../helpers/logger')
const elasticsearch = require('elasticsearch')
const client = new elasticsearch.Client({
  host: 'localhost:9200',
})

const getCharitiesRouter = version => {

  charitiesRouter.get('/', (req, res, next) => {

    const { query, meta } = res.locals.elasticSearch

    const searchParams = Object.assign({}, meta, {
      index: 'charitys',
      body: { query },
    })

    return client.search(searchParams, (err, response) => {
      if (err) {
        log.error(err)
        return res.status(400).send({ message: err.message })
      }
      res.json({ version, query: searchParams, charities: response.hits.hits.map(x => x._source) })
    })
  })

  return charitiesRouter
}

module.exports = getCharitiesRouter
