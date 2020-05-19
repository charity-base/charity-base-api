const country = require("./country")
const geohash = require("./geohash")
const region = require("./region")

function aggGeo(search, args) {
  return {
    country: () => country(search, args),
    geohash: () => geohash(search, args),
    region: () => region(search, args),
  }
}

module.exports = aggGeo
