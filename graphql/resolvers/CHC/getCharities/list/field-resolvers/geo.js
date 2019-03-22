const ES_FIELDS = [
  'contact.geo',
]

const nullGeo = {
  postcode: null,
  quality: null,
  eastings: null,
  northings: null,
  country: null,
  nhs_ha: null,
  longitude: null,
  latitude: null,
  european_electoral_region: null,
  primary_care_trust: null,
  region: null,
  lsoa: null,
  msoa: null,
  incode: null,
  outcode: null,
  parliamentary_constituency: null,
  admin_district: null,
  parish: null,
  admin_county: null,
  admin_ward: null,
  ced: null,
  ccg: null,
  nuts: null,
  codes: {
    admin_district: null,
    admin_county: null,
    admin_ward: null,
    parish: null,
    parliamentary_constituency: null,
    ccg: null,
    ced: null,
    nuts: null,
  }
}

async function getList(
  searchSource,
) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map(x => {
      return x._source.contact ? x._source.contact.geo : nullGeo // todo: investigate how null contact is possible..
    })
  } catch(e) {
    throw e
  }
}

module.exports = getList
