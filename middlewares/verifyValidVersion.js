const verifyValidVersion = acceptedVersion => (req, res, next) => {
  if (req.params.version !== acceptedVersion) {
    return res.status(400).send({
      message: `You requested version ${req.params.version} but only the latest version ${acceptedVersion} is supported.`
    });
  }
  return next()
}

module.exports = verifyValidVersion
