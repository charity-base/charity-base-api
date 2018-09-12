
const parserJSON = x => `${JSON.stringify(x._source)}\n`

const parserCSV = x => {
  const fields = [
    x._source.ids['GB-CHC'],
    x._source.name,
    x._source.contact.postcode,
    x._source.income.latest.total,
    x._source.grants.length,
    x._source.website,
  ]
  const cleanFields = fields.map(col => String(col).replace(/"/g, ''))
  return `"${cleanFields.join(`","`)}"\n`
}

module.exports = { parserCSV, parserJSON }
