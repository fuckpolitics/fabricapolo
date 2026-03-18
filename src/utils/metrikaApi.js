// utils/metrikaApi.js
// Yandex Metrika Reporting API v1 wrapper.
// Docs: https://yandex.ru/dev/metrika/doc/api2/api_v1/intro.html

const BASE = 'https://api-metrika.yandex.net/stat/v1/data'

export class MetrikaApi {
  constructor(token, counterId) {
    this.token = token
    this.counterId = counterId
  }

  _headers() {
    return { Authorization: `OAuth ${this.token}` }
  }

  async _fetch(params) {
    const url = new URL(BASE)
    url.searchParams.set('id', this.counterId)
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v)
    }
    const res = await fetch(url.toString(), { headers: this._headers() })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Metrika API ${res.status}: ${text}`)
    }
    return res.json()
  }

  // Date helpers
  static today() {
    return new Date().toISOString().slice(0, 10)
  }
  static daysAgo(n) {
    const d = new Date()
    d.setDate(d.getDate() - n)
    return d.toISOString().slice(0, 10)
  }

  // Visits + unique visitors for a date range, grouped by day
  async getVisitsByDay(days = 30) {
    return this._fetch({
      metrics: 'ym:s:visits,ym:s:users',
      dimensions: 'ym:s:date',
      date1: MetrikaApi.daysAgo(days - 1),
      date2: MetrikaApi.today(),
      sort: 'ym:s:date',
      limit: days
    })
  }

  // Summary totals for a period
  async getSummary(days = 30) {
    return this._fetch({
      metrics: 'ym:s:visits,ym:s:users,ym:s:bounceRate,ym:s:pageDepth,ym:s:avgVisitDurationSeconds',
      date1: MetrikaApi.daysAgo(days - 1),
      date2: MetrikaApi.today()
    })
  }

  // Top pages by views
  async getTopPages(days = 30, limit = 8) {
    return this._fetch({
      metrics: 'ym:pv:pageviews',
      dimensions: 'ym:pv:URLPathFull',
      date1: MetrikaApi.daysAgo(days - 1),
      date2: MetrikaApi.today(),
      sort: '-ym:pv:pageviews',
      limit
    })
  }

  // Traffic sources
  async getTrafficSources(days = 30) {
    return this._fetch({
      metrics: 'ym:s:visits',
      dimensions: 'ym:s:trafficSourceName',
      date1: MetrikaApi.daysAgo(days - 1),
      date2: MetrikaApi.today(),
      sort: '-ym:s:visits',
      limit: 8
    })
  }

  // Devices
  async getDevices(days = 30) {
    return this._fetch({
      metrics: 'ym:s:visits',
      dimensions: 'ym:s:deviceCategory',
      date1: MetrikaApi.daysAgo(days - 1),
      date2: MetrikaApi.today(),
      sort: '-ym:s:visits'
    })
  }

  // Validate token + counter
  async validate() {
    const res = await fetch(
      `https://api-metrika.yandex.net/management/v1/counter/${this.counterId}`,
      { headers: this._headers() }
    )
    return res.ok
  }
}
