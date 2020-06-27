## Getting Started

Welcome to the CharityBase API documentation!

> **What's an API?**
>
> An API is a generic term for the tool which one piece of software uses to communicate with another. It's an acronym for _application programming interface_, but that's not important to remember. Put simply, the CharityBase API **_allows anyone to plug into our database_**. A user of the API can request specific information about charities in the UK and the API will respond almost immediately with the relevant structured data. This enables organisations to build charitable digital tools without needing to do the heavy lifting of collecting, storing, cleaning, aggregating and serving data.

### Endpoint

To use the API you send an HTTP request to an endpoint and get back a JSON response. CharityBase is a GraphQL API - this differs from the REST paradigm but you can still use your usual tools. The main difference is that there's only one endpoint. Every request you send will be to this URL:

```http
https://charitybase.uk/api/graphql
```

### Authorisation

Every request must be sent with an `Authorization` header of the form:

```
Apikey YOUR_API_KEY
```

where `YOUR_API_KEY` is one of [your keys](https://charitybase.uk/api-portal/keys).

### Query

We request different types of data by specifying a `query` parameter, which is a string. This string is written in GraphQL syntax and specifies everything about the data we want to receive. Don't be put off if the query language is unfamiliar - it's a bit like JSON and doesn't take long to learn. For example, here's a query string to count all charities registered with the Charity Commission for England & Wales (CHC):

```graphql
{
  CHC {
    getCharities(filters: {}) {
      count
    }
  }
}
```

> Whitespace in the query doesn't affect the response - the newlines and indentation here are just for readability.

### Response

We get back a JSON response which can contain a `data` object and an `errors` array:

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

Data can be fetched by sending a `GET` request to the API endpoint, just like you'd do with a REST API. Simply include your query as a URL search parameter:

```http
https://charitybase.uk/api/graphql?query={CHC{getCharities(filters:{}){count}}}
```

Unlike the REST paradigm however, with GraphQL it's also possible (and encouraged) to fetch data using `POST`. This way you don't have to worry about the URL getting too long since the query is sent in a JSON body. The examples below use `POST` but choose whichever method you prefer.

### Basic Example

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

### Arguments

`filters` is required on `getCharities`. Use a `search` or `income` example.

### Query Name

Up until now we've been using a shorthand syntax where we omit both the query keyword and the query name. In production apps it's useful to explicitly tell CharityBase we're sending a query, and to give that query a name. For example, let's name our query `CountCharitiesCHC`:

```graphql
query CountCharitiesCHC {
  CHC {
    getCharities(filters: {}) {
      count
    }
  }
}
```

> This longhand syntax is required if you're using [variables](#variables).

### Variables

Suppose we wanted to query with different argument values depending on some context e.g. user input. One option would be to dynamically create our query string before sending it. However GraphQL provides a neater way to deal with variables which allows us to keep our query strings static. Here's how it works:

- Declare `$variableName` and its type as one of the variables accepted by the query
- Replace the static value in the query with `$variableName`
- Send the variable value in a `variables` JSON parameter alongside the `query` parameter

Let's define a variable `minIncome` in our query:

```graphql
query CountCharitiesCHC($minIncome: Float) {
  CHC {
    getCharities(filters: { finances: { latestIncome: { gte: $minIncome } } }) {
      count
    }
  }
}
```

Now we can send its value in a `variables` object alongside the `query` in the request body:

```json
{
  "query": "...",
  "variables": { "minIncome": 100000 }
}
```

> The declared variable type e.g. `Float` must match the CharityBase schema.

> As with `query`, you may send `variables` as a URL search parameter instead of in the body.

To experiment with the query language and see an interactive schema, visit the [sandbox](/a/sandbox).

### Versioning

There is no versioning.

## Query Examples

## CharityBase Elements

CharityBase Elements is a set of prebuilt UI components, like inputs and maps, which utilise the API for common use cases. Elements are completely customisable and you can style Elements to match the look and feel of your site. They're coming soon...

## React Components

## Schema
