function isAuthenticated(next, source, args, req) {
  if (!req.apiKeyValue) {
    throw `You must supply an Authorization header of the form "Apikey 9447fa04-c15b-40e6-92b6-30307deeb5d1". See https://charitybase.uk/api-portal for more information.`
  }
  if (!req.apiKeyValid) {
    throw `The provided API key is not valid: "${req.apiKeyValue}"`
  }
  return next()
}

module.exports = isAuthenticated
