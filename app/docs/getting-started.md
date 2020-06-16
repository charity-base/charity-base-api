## Getting Started

Welcome to the CharityBase API Documentation!

##### What's an API?

An API is a generic term for the tool which one piece of software uses to communicate with another piece of software. It's an acronym for _application programming interface_, but that's not worth remembering. Put simply, the CharityBase API **_allows anyone to plug into our database_**. A user of the API can send a request for specific information and the API will respond almost immediately with the relevant structured data. This enables organisations to build charitable digital tools without needing to do the heavy lifting of collecting, storing, cleaning, aggregating and serving data.

### Endpoint

CharityBase is a GraphQL API ... It differs from the REST paradigm however you still send an HTTP request and get back a JSON response, and you can use the same tools you're used to. The main difference is that there's only one endpoint, and every request you send will be to this URL:

```http
https://charitybase.uk/api/graphql
```

### Authorisation

Every request must be sent with an `Authorization` header of the form:

```
Apikey YOUR_API_KEY
```

where `YOUR_API_KEY` is one of your keys, generated at the API portal.

### Query

We request different types of data by specifying a `query` parameter, which is a string. This string is written in GraphQL syntax and specifies everything about the data we want to receive. For example, let's say we wanted to count all charities registered with the Charity Commission for England & Wales (CHC). Here's what the query string looks like:

```graphql
{
  CHC {
    getCharities(filters: {}) {
      count
    }
  }
}
```

It might look unfamiliar to begin with but it's a bit like JSON and fairly easy to learn. The indentation is for readability - all the whitespace can be stripped.

### Response

The JSON response can contain a `data` object and an `errors` array:

```json
{
  "data": {...},
  "errors": [...]
}
```

The `data` object is the same shape as the `query` we sent, but with the value now filled in:

```json
{
  "CHC": {
    "getCharities": {
      "count": 168438
    }
  }
}
```

If there are problems with the query, the `data` object may or may not be defined - it depends on the type of error. However the `errors` array is only defined if something went wrong, so check if it exists before trying to read `data`. For example, if we'd misspelt "count" in our query, we'd get this for `errors`:

```json
[
  {
    "message": "Cannot query field \"countt\" on type \"FilteredCharitiesCHC\". Did you mean \"count\"?",
    "locations": [
      {
        "line": 4,
        "column": 7
      }
    ]
  }
]
```

### GET vs POST

In REST APIs you normally read data with a `GET` request and you can do that here too. Simply include your query as a URL search parameter:

```http
https://charitybase.uk/api/graphql?query={CHC{getCharities(filters:{}){count}}}
```

In GraphQL APIs it's also common to use `POST` requests for reading data. That way we don't have to worry about the URL getting too long since the query is sent in a JSON body. The examples below use `POST` but choose whichever method you prefer.

### Basic Examples

These code snippets use the query from above to count all charities registered in England & Wales. Remember to replace `YOUR_API_KEY` with your actual key.

#### cURL

```bash
curl \
  -X POST \
  -H "Authorization: Apikey YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "query": "{ CHC { getCharities(filters: {}) { count } } }" }' \
  https://charitybase.uk/api/graphql
```

#### JavaScript

```javascript
// Optional dependency to run in Node or older browsers: yarn add isomorphic-unfetch
// import fetch from 'isomorphic-unfetch'

const URL = "https://charitybase.uk/api/graphql"
const HEADERS = {
  Authorization: "Apikey YOUR_API_KEY",
  "Content-Type": "application/json",
}
const COUNT_QUERY = `
  {
    CHC {
      getCharities(filters: {}) {
        count
      }
    }
  }
`

function countCharities() {
  return fetch(URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ query: COUNT_QUERY }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error("FETCH ERROR (probably your network)")
      throw err
    })
    .then(({ data, errors }) => {
      if (errors) {
        console.error("QUERY ERRORS")
        throw errors
      }
      console.log(data)
      return data.CHC.getCharities.count
    })
}
```

#### React (JSX)

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

const COUNT_QUERY = gql`
  {
    CHC {
      getCharities(filters: {}) {
        count
      }
    }
  }
`

const CharitiesCount = () => {
  const { loading, error, data } = useQuery(COUNT_QUERY)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  return <p>There are {data.CHC.getCharities.count} charities!</p>
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

#### Python

```python
# pip install requests
import requests

URL = "https://charitybase.uk/api/graphql"
HEADERS = {
    "Authorization": "Apikey YOUR_API_KEY",
    "Content-Type": "application/json",
}
COUNT_QUERY = """
{
  CHC {
    getCharities(filters: {}) {
      count
    }
  }
}
"""

def count_charities():
    try:
      res = requests.post(
          URL,
          headers=HEADERS,
          json={ "query": COUNT_QUERY }
      )
      payload = res.json()
    except Exception as e:
        print("REQUEST ERROR (probably your network)")
        raise Exception(e)
    if "errors" in payload:
        print("QUERY ERRORS")
        raise Exception(payload["errors"])
    print(payload["data"])
    return payload["data"]["CHC"]["getCharities"]["count"]
```

To experiment with the query language and see what fields are available, visit the playground. The contents of the left panel makes up the query string to send in your request, as shown in the examples above. Click on the "Docs" button in the top right corner of the playground for an interactive schema.

## CharityBase Elements

CharityBase Elements is a set of prebuilt UI components, like inputs and maps, which utilise the API for common use cases. Elements are completely customisable and you can style Elements to match the look and feel of your site. They're coming soon...
