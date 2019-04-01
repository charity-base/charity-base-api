const jwt = require('jsonwebtoken')

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
  if (!req.headers || !req.headers.authorization) {
    throw 'No authorization headers sent'
  }
  const authHeaders = req.headers.authorization.split(',').reduce((agg, x) => {
    const [authType, authValue] = x.trim().split(' ')
    return {
      ...agg,
      [authType.toLowerCase()]: authValue,
    }
  }, {})

  if (!authHeaders.bearer) {
    throw 'No Bearer token found in authorization header'
  }

  try {
    req.user = await jwtPromise(authHeaders.bearer)
    return next()
  } catch(e) {
    throw `Failed to decode Bearer token: ${e.message}`
  }

}

module.exports = jwtAuth
