const countCharitiesRouter = require('express').Router()
const log = require('../helpers/logger')


const getCountCharitiesRouter = (esClient, esIndex) => {

  countCharitiesRouter.get('/', (req, res, next) => {

    const { query } = res.locals.elasticSearch

    const searchParams = {
      index: esIndex,
      body: { query },
    }

    return esClient.count(searchParams, (err, response) => {
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
