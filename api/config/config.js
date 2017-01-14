module.exports = function () {
  return {
    listenPort: 80,
    mongo: {
      address: "mongodb://localhost:27017/open-charities",
      config: { autoIndex: true }
    }
  }
}
