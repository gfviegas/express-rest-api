/* eslint-disable camelcase */
const rfr = require('rfr')
const { google } = require('googleapis')
const moment = rfr('helpers/moment')
const GATokenModel = rfr('models/ga_token').model

const { GA_PRIVATE_KEY, GA_CLIENT_EMAIL, GA_VIEW_ID } = process.env

const scopes = 'https://www.googleapis.com/auth/analytics.readonly'

exports.fetchActiveUsers = async (auth) => {
  const { data } = await google.analytics('v3').data.realtime.get({
    auth,
    ids: GA_VIEW_ID,
    metrics: 'rt:activeUsers',
    dimensions: 'rt:deviceCategory'
  })

  const rows = data.rows || []

  const activeUsers = data.totalsForAllResults['rt:activeUsers']
  const activeUsersDevices = rows.reduce((obj, row) => {
    obj[row[0].toLowerCase()] = parseInt(row[1])
    return obj
  }, { mobile: 0, desktop: 0, tablet: 0 })

  return {
    activeUsers,
    activeUsersDevices
  }
}

exports.fetchHighestExitRatePages = async (auth) => {
  const { data } = await google.analytics('v3').data.ga.get({
    auth,
    ids: GA_VIEW_ID,
    metrics: 'ga:exitRate',
    dimensions: 'ga:pagePath',
    sort: '-ga:exitRate',
    'end-date': 'today',
    'start-date': '30daysAgo',
    'max-results': '20'
  })

  const rows = data.rows || []

  const highestExitRatePages = rows.map((row) => {
    const [path, exitRate] = row
    return { path, exitRate }
  })

  return {
    highestExitRatePages
  }
}

exports.fetchEvents = async (auth) => {
  const params = {
    auth,
    ids: GA_VIEW_ID,
    metrics: 'ga:uniqueEvents',
    dimensions: 'ga:eventCategory,ga:eventAction,ga:eventLabel',
    sort: '-ga:eventCategory',
    filters: 'ga:eventAction==step',
    'end-date': 'today',
    'start-date': '30daysAgo'
  }

  const { data } = await google.analytics('v3').data.ga.get(params)

  const rows = data.rows || []

  const events = {}

  Object.entries(data.totalsForAllResults).map(info => {
    const [key, value] = info
    return {
      [key.replace('ga:', '')]: value
    }
  }).map(event => {
    Object.assign(events, event)
    return event
  })

  const eventDetails = rows.map((row, i) => {
    const [eventCategory, eventAction, eventLabel, uniqueEvents] = row
    return { eventCategory, eventAction, eventLabel, uniqueEvents }
  })

  return Object.assign(events, { eventDetails })
}

exports.getToken = async () => {
  const $gte = moment().add(1, 'hour').toDate()
  const lastEmitedToken = await GATokenModel.findOne({ expires_at: { $gte } })
  if (lastEmitedToken) return lastEmitedToken.token

  const jwt = new google.auth.JWT(GA_CLIENT_EMAIL, null, GA_PRIVATE_KEY, scopes)
  const { access_token, expiry_date } = await jwt.authorize()

  if (!access_token || !expiry_date) throw new APIError('failed_to_fetch_token')

  const modelInstance = new GATokenModel({
    expires_at: new Date(expiry_date),
    token: access_token
  })
  await modelInstance.save()

  return modelInstance.token
}

exports.getJWTInstance = () => {
  return new google.auth.JWT(GA_CLIENT_EMAIL, null, GA_PRIVATE_KEY, scopes)
}
