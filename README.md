# CharityBase REST API v4

For documentation on how to use the API, see [CharityBase v4 Docs](https://charitybase.uk/docs/v4/).

JavaScript users can download the official client library here: [npmjs.com/package/charity-base](https://www.npmjs.com/package/charity-base).

There's also a [third party Python client library](https://github.com/drkane/charity-base-client-python).

### Endpoint

```
https://charitybase.uk/api/v4/
```

### Development

```bash
yarn dev
```

#### Environment Variables
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

#### Environment Variables

To ensure our sensitive environment variables are only accessible by the API code, we store them as [Now secrets](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets/).  This is achieved on the command line:

```bash
now secret add charity-base-es-aws-access-key-id example-key-id
now secret add charity-base-es-aws-secret-access-key example-secret-key
...
```

The environment variable names are mapped to the secret names in `env` in [now.json](./now.json).  Note the `@` prefixing each secret name.