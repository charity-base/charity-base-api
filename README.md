# charity-base-api

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

Now you may wish to update port forwarding on the server e.g. with nginx