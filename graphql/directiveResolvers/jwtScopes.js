function jwtScopes(next, source, args, req) {
  const expectedScopes = args.scopes
  const scopes = req.user && req.user.permissions
  const hasAllScopes = scopes && expectedScopes.every(x => scopes.indexOf(x) !== -1)
  if (!hasAllScopes) {
    throw `Not authorized. Expected jwt scopes: "${expectedScopes.join(', ')}"`
  }
  return next()
}

module.exports = jwtScopes
