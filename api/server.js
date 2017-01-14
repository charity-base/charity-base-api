var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    charityController = require('./controllers/charity-controller'),
    config = require('./config/config')();

mongoose.connect(config.mongo.address, { config: config.mongo.config });

// Use middleware to inject bodyparser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/api/v1/charities', charityController.getCharities);

app.listen(config.listenPort, function() {
  console.log('Listening on port ' + config.listenPort);
});
