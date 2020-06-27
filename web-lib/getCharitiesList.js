import gqlFetcher from "./gqlFetcher"

const LIST_CHARITIES = `
  query CBWEB_LIST_CHARITIES(
    $filters: FilterCHCInput!
    $skip: Int
    $sort: SortCHC
  ) {
    CHC {
      getCharities(filters: $filters) {
        count
        list(limit: 30, skip: $skip, sort: $sort) {
          id
          names(all: true) {
            value
            primary
          }
          activities
          geo {
            latitude
            longitude
          }
          finances {
            income
          }
          contact {
            social {
              platform
              handle
            }
          }
          image {
            logo {
              small
            }
          }
          registrations {
            registrationDate
          }
        }
      }
    }
  }
`

export default function ({ filters, skip, sort }) {
  return gqlFetcher({
    query: LIST_CHARITIES,
    variables: { filters, skip, sort },
  }).then((data) => data.CHC.getCharities)
}
