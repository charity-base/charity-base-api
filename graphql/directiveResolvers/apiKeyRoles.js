function apiKeyRoles(next, source, args, req) {
  const expectedRoles = args.roles
  const roles = req.apiKey.roles
  const hasAllRoles = roles && expectedRoles.every(x => roles.indexOf(x) !== -1)
  if (!hasAllRoles) {
    throw `You are not authorized. Expected roles: "${expectedRoles.join(', ')}"`
  }
  return next()
}

module.exports = apiKeyRoles