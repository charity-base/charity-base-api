# charity-base-api

For documentation on how to use the API, see [CharityBase Docs](https://charity-base.github.io/charity-base-docs/).

JavaScript users can download the official client library here: [npmjs.com/package/charity-base](https://www.npmjs.com/package/charity-base).

There's also a [third party Python client library](https://github.com/drkane/charity-base-client-python).

If you're here to develop the API (rather than use the API) keep on reading.

## Development

```bash
npm start
```

## Production Deployment

* Delete local logs and downloads
* Update index name in `config.json`
* Update version in `config.json` and `package.json`
* Update deployment config variables in `package.json`

```bash
npm run build-slc
npm run deploy
```

After deploying a new version you may wish to:

* Update port forwarding on the server e.g. with nginx
* Update the API version in client libraries e.g. [charity-base-client-js](https://github.com/charity-base/charity-base-client-js)
* Update the API version in applications e.g. [charity-base-web](https://github.com/charity-base/charity-base-web)