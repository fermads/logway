let Logger = require('../lib/logger')
let config = require('./config')
let util = require('./util')
let storage = {}, log, regex

class Metric {
  constructor() {
    log = new Logger('metric', config.logger)

    regex = /^[a-z0-9_.]+$/

    setInterval(() => {
      this.send()
    }, config.metric.flushInterval)
  }

  send() {
    if(Object.keys(storage).length === 0)
      return

    process.send(storage, () => {
      storage = {}
    })
  }

  validate(fqn, value) {
    if(typeof value == 'number'
        && fqn.indexOf('.client.') > -1
        && regex.test(value))
      return true

    log.warn('Skipping metric '+ fqn +' '+ value)
    return false
  }

  parse(content) {
    var prefix = ''
    var lines = content.split('\n')

    if(lines.length === 0)
      return

    if(lines[0].indexOf('!') !== -1) {
      prefix = lines[0].split('!')[1]
      lines.shift()
    }

    for(var i = 0; i < lines.length; i++) {
      if(lines[i].indexOf(' ') === -1)
        continue

      var parts = lines[i].split(' ')
      var fqn = prefix + parts[0]
      var value = Number(parts[1])
      var type = parts[2]

      if(!this.validate(fqn, value))
        continue

      log.debug('Adding ('+ type +') metric: '+ fqn +' '+ value)

      if(type == 'c')
        this.count(value, fqn)
      else if(type == 's')
        this.stats(value, fqn)
      else
        log.warn('Invalid metric type '+ type)
    }
  }

  count(value, fqn) {
    storage[fqn] = storage[fqn] ? (storage[fqn] + value) : value
  }

  stats(value, fqn) {
    if(storage[fqn])
      storage[fqn].push(value)
    else
      storage[fqn] = [value]
  }

  write(content) {
    log.debug('Received metrics:'+ util.fmlm(content))
    this.parse(content.toString())
  }
}

module.exports = Metric