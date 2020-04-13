const { Transform } = require('stream')
const SOURCE = require('./fields')

const getValue = (obj, key) => {
  const keys = key.split('.')
  return keys.reduce((agg, x) => (
    agg ? agg[x] : null
  ), obj)
}

const getEscapedString = x => {
  if (!x) {
    return ''
  }
  const str = typeof x === 'string' ? x : (
    JSON.stringify(x)
  )
  return str.replace(/"/g, '""')
}

const parser = doc => {
  const row = SOURCE
    .map(key => {
      const value = getValue(doc, key)
      return `"${getEscapedString(value)}"`
    })
    .join(',') + '\n'
  return row
}

const transformer = new Transform({
  writableObjectMode: true,
  transform(doc, encoding, callback) {
    this.push(
      doc ? parser(doc) : doc
    )
    callback()
  }
})

module.exports = transformer
