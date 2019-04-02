const jwt = require('jsonwebtoken')
const { authHeaders, hasAll } = require('./helpers')

const jwtPromise = token => new Promise((resolve, reject) => {
  jwt.verify(
    token,
    process.env.CHARITY_BASE_AUTH0_JWT_SECRET,
    {
      audience: process.env.CHARITY_BASE_AUTH0_JWT_AUDIENCE,
      issuer: process.env.CHARITY_BASE_AUTH0_JWT_ISSUER,
    },
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
