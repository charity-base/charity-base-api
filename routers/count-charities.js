const countCharitiesRouter = require('express').Router()
const log = require('../helpers/logger')
const elasticsearch = require('elasticsearch')
const client = new elasticsearch.Client({
  host: 'localhost:9200',
})

const getCountCharitiesRouter = version => {

  countCharitiesRouter.get('/', (req, res, next) => {

    const { query } = res.locals.elasticSearch

    const searchParams = {
      index: 'charitys',
      body: { query },
    }

    return client.count(searchParams, (err, response) => {
      if (err) {
        log.error(err)
        return res.status(400).send({ message: err.message })
      }
      res.json({ version, query: searchParams, count: response.count })
    })
  })

  return countCharitiesRouter
}

module.exports = getCountCharitiesRouter
