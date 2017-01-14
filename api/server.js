var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    charityController = require('./controllers/charity-controller'),
    config = require('./config/config')();

mongoose.connect(config.mongo.address, { config: config.mongo.config });

app.get('/api/v1/charities', charityController.getCharities);

app.listen(config.listenPort, function() {
  console.log('Listening on port ' + config.listenPort);
});
