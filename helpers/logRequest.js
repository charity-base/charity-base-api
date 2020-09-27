const log = require('./logger')
const { esClient } = require('../connection')

const {
  CHARITY_BASE_ES_AWS_INDEX_REQUEST,
} = process.env

const apiRequestMapping = {
  _doc: {
    properties: {
      queryTime: {
        type: 'integer'
      },
      apiKey: {
        properties: {
          id: {
            type: 'keyword'
          },
          userId: {
            type: 'keyword'
          },
          roles: {
            type: 'keyword'
          }
        }
      },
      ip: {
        type: 'keyword'
      },
      method: {
        type: 'keyword'
      },
      originalUrl: {
        type: 'keyword'
      },
      query: {
        type: 'text'
      },
      variables: {
        type: 'text'
      },
      operationName: {
        type: 'keyword'
      },
      statusCode: {
        type: 'keyword'
      },
      statusMessage: {
        type: 'text'
      },
      bytesSent: {
        type: 'integer'
      },
      version: {
        type: 'keyword'
      },
      platformVersion: {
        type: 'keyword'
      },
      device: {
        type: 'keyword'
      },
      locale: {
        type: 'keyword'
      },
    }
  }
}

async function createIndexIfNotExists(index) {
  try {
    const indexExists = await esClient.indices.exists({
      index,
    })
    if (indexExists) return
  } catch(e) {
    log.error(`Failed to check if index exists '${index}'`)
    log.error(e.message)
  }

  try {
    const res = await esClient.indices.create({
      index,
      body: {
        settings: {
          'index.mapping.coerce': true,
          'index.mapping.ignore_malformed': false,
          'index.requests.cache.enable': true,
        },
        mappings: apiRequestMapping,
      }
    })
    log.info(`Successfully created index '${index}'`)
  } catch(e) {
    log.error(`Failed to create index '${index}'`)
    log.error(e.message)
  }
}

const logRequest = (req, res, graphQLParams) => {
  try {
    const t0 = Date.now()

    const cleanup = () => {
      res.removeListener('finish', persist)
    }

    async function persist() {
      cleanup()

      const reqLog = {
        queryTime: Date.now() - t0,
        apiKey: req.apiKey,
        ip: req.ip,
        method: req.method,
        originalUrl: req.originalUrl,
        query: graphQLParams.query,
        variables: JSON.stringify(graphQLParams.variables),
        operationName: graphQLParams.operationName,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        bytesSent: parseInt(res.get('Content-Length')) || 0,
        version: req.get('X-ClientVersion'),
        platformVersion: req.get('X-ClientPlatformVersion'),
        device: req.get('X-ClientDevice'),
        locale: req.get('X-ClientLocale'),
      }

      try {
        await esClient.create({
          index: CHARITY_BASE_ES_AWS_INDEX_REQUEST,
          type: '_doc',
          id: `${t0}-${reqLog.queryTime}`,
          body: reqLog,
        })
        log.info(`Successfully logged API request`)
      } catch(e) {
        log.error(`Failed to log API request`)
        log.error(reqLog)
        log.error(e.message)
      }
    }

    res.on('finish', persist) // does not account for 'close' or 'error' events

  } catch(e) {
    log.error(`Failed to log API request`)
    log.error(graphQLParams)
    log.error(e.message)
  }
}

createIndexIfNotExists(CHARITY_BASE_ES_AWS_INDEX_REQUEST)
module.exports = logRequest
