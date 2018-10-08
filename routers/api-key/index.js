const uuidv4 = require('uuid/v4')
const apiKeyRouter = require('express').Router()
const { Client } = require('../../models')

const MAX_KEYS = 3

const getApiKeyRouter = () => {

  apiKeyRouter.get('/', (req, res, next) => {
    const clientId = req.user.sub

    Client.findOne({ clientId }, 'apiKeys', (err, client) => {
      if (err) {
        return res.status(400).send({ message: err.message })
      }
      const apiKeys = client ? client.apiKeys : []
      return res.json({
        version: req.params.version,
        apiKeys,
      })
    })
  })

  apiKeyRouter.post('/', (req, res, next) => {
    const clientId = req.user.sub
    const newApiKeyObj = {
      value: uuidv4(),
      scopes: ['basic'],
    }

    Client.findOne({ clientId }, (err, client) => {
      if (err) {
        return res.status(400).send({ message: err.message })
      }
      if (!client) {
        client = new Client({ clientId, apiKeys: [] })
      }
      if (client.apiKeys.length === MAX_KEYS) {
        return res.status(400).send({ message: `You already have the maximum of ${MAX_KEYS} API keys` })
      }
      client.apiKeys.push(newApiKeyObj)
      return client.save((e, u) => {
        if (e) {
          return res.status(400).send({ message: e.message })
        }
        return res.status(201).send({
          version: req.params.version,
          apiKeys: u.apiKeys,
        })
      })
    })
  })

  apiKeyRouter.delete('/:apiKey', (req, res, next) => {
    const clientId = req.user.sub
    const oldApiKeyValue = req.params.apiKey

    if (oldApiKeyValue === req.apiKeyValue) {
      return res.status(400).send({ message: 'Cannot delete API key used in request' })
    }

    Client.findOne({ clientId }, (err, client) => {
      if (err) {
        return res.status(400).send({ message: err.message })
      }
      if (!client) {
        return res.status(401).send({ message: 'No client found' })
      }
      const { apiKeys } = client
      client.apiKeys = apiKeys.filter(x => x.value !== oldApiKeyValue)
      if (client.apiKeys.length === apiKeys.length) {
        return res.status(404).send({ message: 'Could not find that API key for this client' })
      }
      return client.save((e, u) => {
        if (e) {
          return res.status(400).send({ message: e.message })
        }
        return res.json({
          version: req.params.version,
          apiKeys: u.apiKeys,
        })
      })
    })
  })

  return apiKeyRouter

}

module.exports = getApiKeyRouter
