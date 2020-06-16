# Getting Started

## What's an API?

An API is a generic term for the tool which one piece of software uses to communicate with another piece of software. Don't worry about what it stands for.

Put simply, the CharityBase API allows anyone to plug into our database. A user of the API can send a request for specific information and the API will respond almost immediately with the relevant structured data.

The CharityBase API enables organisations to build charitable digital tools without needing to do the heavy lifting of collecting, cleaning, storing, aggregating & serving data.

## CharityBase Elements Overview

CharityBase Elements is a set of prebuilt UI components, like inputs and maps, which utilise the API for common use cases. Elements are completely customisable and you can style Elements to match the look and feel of your site. They're coming soon...

## Using the API directly

If Elements do not serve your needs...

CharityBase is a GraphQL API which gives you the power to ask for exactly the data you need. There's a single endpoint `https://charitybase.uk/api/graphql` where you can send either a `GET` or a `POST` request. The request must contain a `query` parameter in the query string or optionally in the JSON body (if using `POST`). You must also supply an `Authorization` header of the form `Apikey YOUR_API_KEY`.

## Examples

Here's a basic example which counts all charities registered with the Charity Commission. Remember to replace `YOUR_API_KEY` with your actual key.

### cURL

```bash
# Using GET:
curl \
  -H "Authorization: Apikey YOUR_API_KEY" \
  "https://charitybase.uk/api/graphql?query=\{CHC\{getCharities(filters:\{\})\{count\}\}\}"

# Or using POST:
curl \
  -X POST \
  -H "Authorization: Apikey YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "query": "{ CHC { getCharities(filters: {}) { count } } }" }' \
  https://charitybase.uk/api/graphql
```

### JavaScript

```javascript
// yarn add isomorphic-unfetch (optional)
// import fetch from 'isomorphic-unfetch' (to work on server & client)

const QUERY = `
  {
    CHC {
      getCharities(filters: {}) {
        count
      }
    }
  }
`

// Using GET:
const URL = `https://charitybase.uk/api/graphql?query=${QUERY}`
const OPTS = {
  headers: {
    Authorization: "Apikey YOUR_API_KEY",
  },
}

// Or using POST:
const URL = "https://charitybase.uk/api/graphql"
const OPTS = {
  method: "POST",
  headers: {
    Authorization: "Apikey YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: QUERY }),
}

fetch(URL, OPTS)
  .then((res) => res.json())
  .catch(() => {
    // probably a network error
  })
  .then(({ data, errors }) => {
    if (errors) {
      return console.log("ERRORS: ", errors)
    }
    console.log(data)
    // { CHC: { getCharities: { count: 168438 } } }
  })
```

### React (JSX)

```jsx
// yarn add apollo-boost @apollo/react-hooks graphql
import ApolloClient, { gql } from "apollo-boost"
import { ApolloProvider, useQuery } from "@apollo/react-hooks"

const client = new ApolloClient({
  uri: "https://charitybase.uk/api/graphql",
  headers: {
    Authorization: "Apikey YOUR_API_KEY",
  },
})

const QUERY = gql`
  {
    CHC {
      getCharities(filters: {}) {
        count
      }
    }
  }
`

const CharitiesCount = () => {
  const { loading, error, data } = useQuery(QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  return <p>Successfully counted {data.CHC.getCharities.count} charities</p>
}

const App = () => {
  return (
    <ApolloProvider client={client}>
      <h1>CharityBase Demo 🚀</h1>
      <CharitiesCount />
    </ApolloProvider>
  )
}
```

To experiment with the query language and see what fields are available, visit the playground. The contents of the left panel makes up the query string to send in your request, as shown in the examples above. Click on the "Docs" button in the top right corner of the playground for an interactive schema.
