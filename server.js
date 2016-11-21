var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    https = require('https'),
    charityController = require('./api/controllers/charity-controller'),
    config = require('./api/config/config')();

mongoose.connect(config.mongo.address, { config: config.mongo.config });


// Use middleware to inject bodyparser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

if (config.ssl.runHttps) {
  // redirect http requests
  app.use(function(req, res, next) {
    if(!req.secure) {
      return res.redirect(config.baseUrl() + req.url);
    }
    next();
  });
}

app.get('/api/charities', charityController.getCharities);

if (config.ssl.runHttps) {

  var sslCreds = {
    key: fs.readFileSync(config.ssl.privateKeyFile, 'utf8'),
    cert: fs.readFileSync(config.ssl.certificateFile, 'utf8'),
    ca: fs.readFileSync(config.ssl.intermediateFile, 'utf8')
  };

  https.createServer(sslCreds, app).listen(config.ssl.listenPort, function() {
    console.log('Listening on port ' + config.ssl.listenPort);
  });
}

app.listen(config.listenPort, function() {
  console.log('Listening on port ' + config.listenPort);
});
