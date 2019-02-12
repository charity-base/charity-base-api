var { buildSchema } = require('graphql')

var schema = buildSchema(`
  input FilterGB {
    search: String
  }

  type CharityGB {
    id: String
    name: String
    activities: String
  }
  
  type FilteredCharitiesGB {
    list(limit: Int, skip: Int, sort: String): [CharityGB]
  }

  type Query {
    getCharitiesGB(filters: FilterGB!): FilteredCharitiesGB
  }
`)

module.exports = schema


// getCharities(
//   filters={
//     search: 'oxfam',
//   }
// ) {
//   list (limit='20', skip='10', sort=['score', 'income', 'id']) { //maybe sort should be a scalar actually (and always add id sort after on server)
//     ids
//     name
//     activities
//   }
//   downloadList {
//     url
//   }
//   aggregate {
//     all {
//       id
//       name
//       count
//       sumIncome
//       avgIncome
//     }
//     geo(type=hash, boundingBox='51.01,....') { //type could be enum [hash, county, ward, lsoa, ...] // how to limit resolution? for geohash as well as ward etc.  do we check to see if there's a filter on county?  or check bounding box in filter?  or just limit bins to ~100 and leave it up to user to choose appropriate scale?
//       id
//       name
//       count
//       sumIncome
//       avgIncome
//     }
//     income(log='true') {
//       id
//       name
//       count
//       sumIncome
//       avgIncome
//     }
//     employees(log=false) {
//       id
//       name
//       count
//       sumIncome
//       avgIncome
//     }
//   }
// }