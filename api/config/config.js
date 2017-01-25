module.exports = function () {
  return {
    listenPort: 3000,
    mongo: {
      address: "mongodb://localhost:27017/open-charities",
      config: { autoIndex: true }
    }
  }
}
