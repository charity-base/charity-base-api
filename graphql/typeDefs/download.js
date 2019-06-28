const typeDefs = `
  type DownloadCHC {
    """URL of output file"""
    url: String
    """Content-Length of output file"""
    size: Int
  }
`

module.exports = typeDefs
