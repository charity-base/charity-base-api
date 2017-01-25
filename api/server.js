var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    charityController = require('./controllers/charity-controller'),
    config = require('./config/config')();

mongoose.connect(config.mongo.address, { config: config.mongo.config });
mongoose.Promise = global.Promise;

var homeTemplate = `
  <!DOCTYPE html>
  <div>
    Congratulations, you've made an API!
  </div>
  <div>
    The main endpoint is
    <a href="/api/v1/charities">/api/v1/charities</a>
  </div>
  <div>
    Take a look at the
    <a href="https://github.com/tithebarn/open-charities/blob/master/api/README.md">README</a>
    for more information.
  </div>
`;

app.get('/', function(req, res) {
  res.send(homeTemplate);
});

app.get('/api/v1/charities', charityController.getCharities);

app.listen(config.listenPort, function() {
  console.log('Listening on port ' + config.listenPort);
});
