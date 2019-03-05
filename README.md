# CharityBase GraphQL API

* [Using the API](#using-the-api)
  * [Playground](#playground)
  * [Endpoint](#endpoint)
  * [Versioning](#versioning)
  * [Authorization](#authorization)
* [Working on the API](#working-on-the-api)
  * [Development](#development)
    * [Dev Environment Variables](#dev-environment-variables)
  * [Deployment](#development)
    * [Prod Environment Variables](#prod-environment-variables)

## Using the API

### Playground

For testing queries and viewing the interactive docs, use the [GraphiQL interface](https://charitybase.uk/api-explorer).

### Endpoint

The API has a single endpoint:

```
https://charitybase.uk/api/graphql
```

As described in the [GraphQL docs](https://graphql.org/learn/serving-over-http/) you can send either a `GET` or `POST` request and the query string can either be written in the url or in the body (if using POST).

### Versioning

The API is versionless - we won't introduce any breaking changes. [What?!](https://graphql.org/learn/best-practices/#versioning)

### Authorization

Whether using `GET` or `POST`, put your API key in an Authorization header like so:

```json
"Authorization": "Apikey 9447fa04-c15b-40e6-92b6-30307deeb5d1"
```

Replace the above key with your own (available from the [API Portal](https://charitybase.uk/api-portal)) and be sure to keep the `Apikey ` prefix as above.

## Working on the API

### Development

```bash
yarn dev
```

#### Dev Environment Variables
Expected environment variables are listed in `env` in [now.json](./now.json).  You may define them in a `.env` as follows:

```bash
# example .env file in charity-base-api
CHARITY_BASE_ES_AWS_ACCESS_KEY_ID=example-key-id
CHARITY_BASE_ES_AWS_SECRET_ACCESS_KEY=example-secret-key
...
```

Note: these values will not override any environment variables already set e.g. in your `.bash_profile`.


### Deployment

```bash
yarn deploy:production
```

Note: this requires [Now](https://zeit.co/now) which can be installed globally with npm: `npm i -g now`

#### Prod Environment Variables

To ensure our sensitive environment variables are only accessible by the API code, we store them as [Now secrets](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets/).  This is achieved on the command line:

```bash
now secret add charity-base-es-aws-access-key-id example-key-id
now secret add charity-base-es-aws-secret-access-key example-secret-key
...
```

The environment variable names are mapped to the secret names in `env` in [now.json](./now.json).  Note the `@` prefixing each secret name.
