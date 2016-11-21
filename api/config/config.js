module.exports = function () {

  var config = {
    domain: "opencharities.org.uk",
    listenPort: 80,
    ssl: {
      runHttps: false,
      listenPort: null,
      privateKeyFile: null,
      certificateFile: null,
      intermediateFile: null,
    },
    baseUrl: function() {
      if (this.ssl.runHttps) {
        return "https://" + this.domain + ":" + this.ssl.listenPort;
      }
      return "http://" + this.domain + ":" + this.listenPort;
    },
    mongo: {
      address: "mongodb://localhost:27017/open-charities",
      config: { autoIndex: true }
    }
  };

  return config;
};
