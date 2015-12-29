let Logger = require('../lib/logger')
let config = require('./config')
let util = require('./util')
let storage = {}, log

class Metric {
  constructor() {
    log = new Logger('metric', config.logger)

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
    if(value !== ''
        && !isNaN(value)
        && fqn.indexOf('.client.') > -1
        && /^[a-z0-9_.]+$/.test(value))
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

      if(storage[fqn] && type === 'a')
        storage[fqn] = storage[fqn] + value
      else if (type === 'a')
        storage[fqn] = value
      else if(storage[fqn] && type === 's')
        storage[fqn].push(value)
      else if(type === 's')
        storage[fqn] = [value]
    }
  }

  write(content) {
    log.debug('Received metrics:'+ util.fmlm(content))
    this.parse(content.toString())
  }
}

module.exports = Metric