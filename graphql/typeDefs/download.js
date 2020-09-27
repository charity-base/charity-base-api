const typeDefs = `
  type DownloadCHC {
    """Name of output file"""
    name: String
    """Content-Length of output file"""
    size: Int
    """URL of output file"""
    url: String
  }
`

module.exports = typeDefs
