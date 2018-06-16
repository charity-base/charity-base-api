const charityRouter = require('express').Router()
const log = require('../helpers/logger')
const elasticsearch = require('elasticsearch')
const client = new elasticsearch.Client({
  host: 'localhost:9200',
})

const getCharityRouter = version => {

  charityRouter.get('/', (req, res, next) => {

    const { query, meta } = res.locals.elasticSearch

    const searchParams = Object.assign({}, meta, {
      index: 'charitys',
      body: { query },
    })

    return client.search(searchParams, (err, results) => {
      if (err) {
        log.error(err)
        return res.status(400).send({ message: err.message })
      }
      res.json({ version, query: searchParams, charities: results.hits.hits.map(x => x._source) })
    })
  })

  return charityRouter
}

module.exports = getCharityRouter
