function hasScopes(next, source, args, req) {
  const expectedScopes = args.scopes
  const scopes = req.apiScopes
  const hasAllScopes = scopes && expectedScopes.every(x => scopes.indexOf(x) !== -1)
  if (!hasAllScopes) {
    throw `You are not authorized. Expected scopes: "${expectedScopes.join(', ')}"`
  }
  return next()
}

module.exports = hasScopes