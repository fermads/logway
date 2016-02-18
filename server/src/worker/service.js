let Logger = require('../../lib/logger')
let config = require('../config')
let util = require('../util')
let metrics = {}, weblogs = [], log, regex, id

class Service {

  constructor () {
    id = process.env.id
    log = new Logger('service' + id, config.logger)

    regex = /^[a-z0-9_.]+$/

    setInterval(() => {
      this.send()
    }, config.service.flushInterval)
  }

  send () {
    if (Object.keys(metrics).length === 0 && weblogs.length === 0)
      return

    process.send({ metrics: metrics, weblogs: weblogs }, () => {
      metrics = {}
      weblogs = []
    })
  }

  validate (prefix, parts, fqn, value) {
    if (typeof value !== 'number'
        || parts.length !== 3
        || prefix.length < 9 // at least x.client.
        || fqn.indexOf('.client.') === -1
        || value > 9e+20
        || !regex.test(fqn)) {
      log.warn('Skipping metric ' + fqn + ' ' + value)
      return false
    }
    return true
  }

  parse (content) {
    var prefix = ''
    var lines = content.split('\n')

    if (lines[0].indexOf('p ') === 0) {
      prefix = lines[0].split(' ')[1]
      lines.shift()
    }

    if (lines.length < 1)
      return log.info('Invalid content')

    // do not accept more then maxLinesPerPost
    var llen = lines.length > config.service.maxLinesPerPost
      ? config.service.maxLinesPerPost
      : lines.length

    for (var i = 0; i < llen; i++) {
      if (lines[i].indexOf(' ') !== 1) { // second char must be a space
        log.debug('Invalid metric format:', lines[i])
        continue
      }

      var parts = lines[i].split(' ')
      var type = parts[0]

      if (type === 'l') { // web log only need 'l ' to work
        this.weblog(lines[i].substr(2)) // remove the type (first 2 chars)
        continue
      }

      var fqn = prefix + parts[1]
      var value = Number(parts[2])

      if (!this.validate(prefix, parts, fqn, value))
        continue

      if (type === 'c')
        this.count(value, fqn)
      else if (type === 's')
        this.stats(value, fqn)
      else
        log.warn('Invalid type ' + type)
    }
  }

  weblog (msg) {
    log.debug('Adding log: ' + msg)
    weblogs.push(msg)
  }

  count (value, fqn) {
    log.debug('Adding count: ' + fqn + ' ' + value)
    metrics[fqn] = metrics[fqn] ? (metrics[fqn] + value) : value
  }

  stats (value, fqn) {
    log.debug('Adding stats: ' + fqn + ' ' + value)
    if (metrics[fqn])
      metrics[fqn].push(value)
    else
      metrics[fqn] = [value]
  }

  write (content) {
    log.debug('Received content:' + util.fmlm(content))
    this.parse(content.toString())
  }
}

module.exports = Service
