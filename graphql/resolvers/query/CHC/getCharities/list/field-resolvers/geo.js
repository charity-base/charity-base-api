const ES_FIELDS = [
  'postcodeGeo',
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
  admin_county: null,
  admin_ward: null,
  parish: null,
  ced: null,
  ccg: null,
  nuts: null,
  codes: {
    admin_district: null,
    admin_county: null,
    admin_ward: null,
    parish: null,
    parliamentary_constituency: null,
    ced: null,
    ccg: null,
    nuts: null,
  }
}

const parse = postcodeGeo => {
  if (!postcodeGeo) {
    return nullGeo
  }
  const { id, coordinates, codes, names } = postcodeGeo
  return {
    postcode: id,
    quality: null,
    eastings: coordinates.easting,
    northings: coordinates.northing,
    country: null,
    nhs_ha: null,
    longitude: coordinates.lon,
    latitude: coordinates.lat,
    european_electoral_region: names.eer,
    primary_care_trust: codes.pct, // this used to be a name not a code (but name not yet in postcode-gql)
    region: codes.rgn, // this used to be a name not a code (but name not yet in postcode-gql)
    lsoa: names.lsoa11,
    msoa: names.msoa11,
    incode: null,
    outcode: null,
    parliamentary_constituency: names.pcon,
    admin_district: names.laua,
    admin_county: names.cty,
    admin_ward: names.ward,
    parish: null,
    ced: null,
    ccg: names.ccg,
    nuts: null,
    codes: {
      admin_district: codes.laua,
      admin_county: codes.cty,
      admin_ward: codes.ward,
      parish: null,
      parliamentary_constituency: codes.pcon,
      ced: codes.ced,
      ccg: codes.ccg,
      nuts: codes.nuts, // used to be like "UKI32" (from postcodes.io), now like "E05000644" (from postcode-gql)
    }
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
      return parse(x._source.postcodeGeo)
    })
  } catch(e) {
    throw e
  }
}

module.exports = getList
