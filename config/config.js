module.exports = function () {
  return {
    listenPort: 3000,
    mongo: {
      address: "mongodb://localhost:27017/tithe-barn",
      config: { autoIndex: true }
    }
  }
}
