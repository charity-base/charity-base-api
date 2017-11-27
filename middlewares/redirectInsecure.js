const redirectInsecure = (domain, sslPort) => (req, res, next) => {
  if (sslPort && !req.secure) {
    return res.redirect(`https://${domain}:${sslPort}${req.url}`);
  }
  return next();
}

module.exports = redirectInsecure;
