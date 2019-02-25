const log = require('./logger')

const logRequest = (req, res, graphQLParams) => {

  try {
    const t0 = Date.now()

    const cleanup = () => {
      res.removeListener('finish', persist)
    }

    const persist = () => {
      cleanup()

      const reqLog = {
        queryTime: Date.now() - t0, // does not include api key lookup
        apiKeyValue: req.apiKeyValue,
        apiKeyValid: req.apiKeyValid,
        apiScopes: req.apiScopes,
        ip: req.ip,
        method: req.method,
        originalUrl: req.originalUrl,
        query: graphQLParams.query,
        variables: graphQLParams.variables,
        operationName: graphQLParams.operationName,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        bytesSent: res.get('Content-Length') || 0,
        version: req.get('X-ClientVersion'),
        platformVersion: req.get('X-ClientPlatformVersion'),
        device: req.get('X-ClientDevice'),
        locale: req.get('X-ClientLocale'),
      }

      log.info(reqLog)
      // todo: put into elasticsearch
    }

    res.on('finish', persist) // does not account for 'close' or 'error' events

  } catch(e) {
    // we don't want this to hold up the request
    log.error(e)
    // maybe we should try log the raw url request
  }

}

module.exports = logRequest