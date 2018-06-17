const { Readable } = require('stream')

class ElasticStream extends Readable {
  constructor(opt) {
    super(opt)
    this._client = opt.client
    this._searchParams = opt.searchParams
    this._count = 0
    this._responseQueue = []
    this._startedReading = false
  }

  async _read() {

    if (!this._startedReading) {
      this._responseQueue.push(
        await this._client.search(this._searchParams).catch(e => this.emit('error', e))
      )
    }

    this._startedReading = true

    while (this._responseQueue.length) {
      const response = this._responseQueue.shift()

      this._count += response.hits.hits.length

      const data = response.hits.hits.reduce((agg, x) => `${agg}${JSON.stringify(x)}\n`, '')
      this.push(data)

      if (response.hits.total === this._count) {
        this.push(null)
        break
      }

      this._responseQueue.push(
        await this._client.scroll({
          scrollId: response._scroll_id,
          scroll: this._searchParams.scroll,
        }).catch(e => this.emit('error', e))
      )
    }
  }
}

module.exports = ElasticStream
