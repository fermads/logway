let Server = require('./server')
let Logger = require('../lib/logger')
let config = require('./config')
let log, id, storage = {}

class Worker {
  constructor() {
    id = process.env.id
    process.title = 'node ferlog worker '+ id

    log = new Logger('worker'+ id, config.logger)

    new Server()

    this.bind()

    setInterval(() => {
      this.send()
    }, config.graphite.flushInterval)

    log.info('Worker '+ id +' started')
  }

  send() {
    if(Object.keys(storage).length === 0)
      return

    process.send(storage, () => {
      storage = {}
    })
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

      if(storage[fqn])
        storage[fqn] = storage[fqn] + value
      else
        storage[fqn] = value
    }
  }

  bind() {
    // master -> worker comm
    // process.on('message', function(data) {
    //   log.info(data)
    // })

    process.on('uncaughtException', function(error) {
      log.fatal(error.stack)
      process.exit(1)
    })
  }
}

module.exports = Worker