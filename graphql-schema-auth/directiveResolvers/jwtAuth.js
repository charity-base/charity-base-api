const jwt = require('jsonwebtoken')
const { authHeaders, hasAll } = require('./helpers')

const jwtPromise = token => new Promise((resolve, reject) => {
  const audience = process.env.CHARITY_BASE_AUTH0_JWT_AUDIENCE
  const issuer = process.env.CHARITY_BASE_AUTH0_JWT_ISSUER
  const secret = process.env.CHARITY_BASE_AUTH0_JWT_SECRET
  if (!audience || !issuer || !secret) {
    return reject(new Error('JWT audience, issuer and secret must be defined in env variables'))
  }
  jwt.verify(
    token,
    secret,
    { audience, issuer },
    (err, decoded) => {
      if (err) {
        return reject(err)
      }
      resolve(decoded)
    }
  )
})

async function jwtAuth(next, source, args, req) {
  const expectedScopes = args.scopes

  if (req.user) {
    const scopes = req.user.permissions || []
    if (!hasAll(expectedScopes, scopes)) {
      throw `You are not authorized. Expected jwt scopes: "${expectedScopes.join(', ')}"`
    }
    return next()
  }

  if (!req.headers || !req.headers.authorization) {
    throw 'No authorization header sent'
  }

  const { bearer } = authHeaders(req.headers.authorization)

  if (!bearer) {
    throw 'No Bearer token found in authorization header'
  }

  try {
    req.user = await jwtPromise(bearer)
  } catch(e) {
    throw `Failed to decode Bearer token: ${e.message}`
  }

  const scopes = req.user.permissions || []
  if (!hasAll(expectedScopes, scopes)) {
    throw `You are not authorized. Expected jwt scopes: "${expectedScopes.join(', ')}"`
  }

  return next()
}

module.exports = jwtAuth
