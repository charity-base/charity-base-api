const authHeaders = authHeaderString => {
  return authHeaderString.split(',').reduce((agg, x) => {
    const [authType, authValue] = x.trim().split(' ')
    return {
      ...agg,
      [authType.toLowerCase()]: authValue,
    }
  }, {})
}

const hasAll = (required, given) => {
  return required.every(x => given.indexOf(x) !== -1)
}

module.exports = {
  authHeaders,
  hasAll,
}
