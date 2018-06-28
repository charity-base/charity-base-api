const countCharitiesRouter = require('express').Router()
const log = require('../helpers/logger')
const elasticsearch = require('elasticsearch')


const getCountCharitiesRouter = elasticConfig => {

  const client = new elasticsearch.Client({
    host: elasticConfig.host,
  })

  countCharitiesRouter.get('/', (req, res, next) => {

    const { query } = res.locals.elasticSearch

    const searchParams = {
      index: elasticConfig.index,
      body: { query },
    }

    return client.count(searchParams, (err, response) => {
      if (err) {
        log.error(err)
        return res.status(400).send({ message: err.message })
      }
      res.json({
        version: req.params.version,
        query: searchParams,
        count: response.count
      })
    })
  })

  return countCharitiesRouter
}

module.exports = getCountCharitiesRouter
