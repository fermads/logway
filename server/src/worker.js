let Server = require('./server')
let Logger = require('../lib/logger')
let config = require('./config')
let log, id

class Worker {
  constructor() {
    id = process.env.id
    process.title = 'node logui worker '+ id

    log = new Logger('worker'+ id, config.logger)

    new Server()

    this.bind()
    log.info('Worker '+ id +' started')
  }

  bind() {
    process.on('message', function(data) { // spread master > worker
      log.info(data)
    })

    process.on('uncaughtException', function(error) {
      log.fatal(error.stack)
      process.exit(1)
    })
  }
}

module.exports = Worker