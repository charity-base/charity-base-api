var express = require('express'),
    app = express(),
    cors = require('cors'),
    https = require('https'),
    fs = require('fs'),
    apiRouter = require('./routers'),
    config = require('./config.json'),
    redirectInsecure = require('./middlewares/redirectInsecure');

const connectToDb = require('./helpers/connectToDb');

connectToDb(config.dbUrl, {
  useMongoClient: true,
  autoIndex: true
});

app.use(cors());

app.use(redirectInsecure(config.domain, config.sslPort));

app.use(express.static(config.staticFilesDirectory));

app.use('/api/:version/', apiRouter(config));

app.listen(config.port, function() {
  console.log('Listening on port ' + config.port);
});

if (config.sslPort) {
  const sslCreds = {
    key: fs.readFileSync(config.keyFilename, 'utf8'),
    cert: fs.readFileSync(config.certFilename, 'utf8'),
    ca: fs.readFileSync(config.caFilename, 'utf8')
  };
  https.createServer(sslCreds, app).listen(config.sslPort, () => {
    console.log(`Listening on port ${config.sslPort}`);
  });
}
