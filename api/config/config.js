module.exports = function () {
  return {
    listenPort: 3000,
    mongo: {
      address: "mongodb://localhost:27017/charity-base",
      config: { autoIndex: true }
    }
  }
}
