import gqlFetcher from "./gqlFetcher"

const GET_CHARITY = `
  query CBWEB_GET_CHARITY(
    $id: ID
  ) {
    CHC {
      getCharities(filters: { id: [$id] }) {
        list {
          activities
          areas {
            id
            name
          }
          beneficiaries {
            id
            name
          }
          causes {
            id
            name
          }
          contact {
            address
            email
            phone
            postcode
            social {
              platform
              handle
            }
          }
          finances(all: true) {
            income
            spending
            financialYear {
              end
            }
          }
          grants {
            id
            title
            description
            fundingOrganization {
              id
              name
            }
            amountAwarded
            currency
            awardDate
          }
          id
          image {
            logo {
              medium
            }
          }
          names(all: true) {
            value
            primary
          }
          numPeople {
            employees
            trustees
            volunteers
          }
          operations {
            id
            name
          }
          orgIds {
            id
            rawId
            scheme
          }
          registrations(all: true) {
            registrationDate
            removalDate
            removalReason
          }
          website
        }
      }
    }
  }
`

export default function ({ id }) {
  return gqlFetcher({
    query: GET_CHARITY,
    variables: { id },
  }).then((data) => data.CHC.getCharities)
}
