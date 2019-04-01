const authHeaders = authHeaderString => {
  return authHeaderString.split(',').reduce((agg, x) => {
    const [authType, authValue] = x.trim().split(' ')
    return {
      ...agg,
      [authType.toLowerCase()]: authValue,
    }
  }, {})
}

module.exports = {
  authHeaders,
}