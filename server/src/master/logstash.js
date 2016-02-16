let net = require('net')
let Logger = require('../../lib/logger')
let config = require('../config')
let util = require('../util')

let log, options, storage = [], hp, socket, sending = false

class Logstash {

  constructor () {
    log = new Logger('logstash', config.logger)
    options = config.logstash
    hp = options.host + ':' + options.port

    setInterval(this.send, options.flushInterval)

    this.connect()
  }

  connect () {
    if (socket) {
      socket.destroy()
      socket = null
    }

    socket = new net.Socket(options.host)
    socket.connect(options.port, options.host)

    socket.on('connect', () => {
      log.info('Connected to Logstash server ' + hp)
    })

    socket.on('error', e => {
      log.error('Error connecting to Logstash: ' + e.message)
    })

    socket.on('close', () => {
      setTimeout(() => {
        log.info('Trying to reconnect to ' + hp)
        this.connect(options)
      }, options.reconnectInterval)
    })
  }

  send () {
    var size = storage.length
    var output = ''

    if (size === 0)
      return

    if (size > options.maxLogsPerInterval)
      return log.error('Skipping this batch! Too big! Size: ' + size + ' lines')

    if (sending === true) {
      storage = []
      return log.error('Skipping this batch! Last one is still sending')
    }

    sending = true
    output = storage.join('\n')

    storage = []

    if (socket.writable && output) {
      socket.write(output, 'utf8', () => {
        sending = false
        log.debug('Logs sent to Logstash server:' + util.fmlm(output))
      })
    }
    else {
      sending = false
    }
  }

  add (lines) {
    for (var i = 0; i < lines.length; i++) {
      storage.push(lines[i])
    }
  }
}

module.exports = Logstash
