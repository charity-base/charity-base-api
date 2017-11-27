const verifyValidVersion = version => (req, res, next) => {
  if (req.params.version !== version) {
    return res.status(400).send({
      message: `You requested version ${req.params.version} but only the latest version ${version} is supported`
    });
  }
  return next();
}

module.exports = verifyValidVersion;
