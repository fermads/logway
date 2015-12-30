let os = require('os')
let net = require('net')
let Logger = require('../lib/logger')
let Stats = require('../lib/statistics')
let config = require('./config')
let util = require('./util')

let storage = {}, socket, log, hp, options, stats, sending = false

class Graphite {
  constructor() {
    log = new Logger('graphite', config.logger)
    stats = new Stats()
    options = config.graphite
    hp = options.host +':'+ options.port

    options.hostname = os.hostname()

    setInterval(() => {
      this.send()
    }, options.flushInterval)

    this.connect()
  }

  connect() {
    if(socket) {
      socket.destroy()
      socket = null
    }

    socket = new net.Socket(options.host)
    socket.connect(options.port, options.host)

    socket.on('connect', () => {
      log.info('Connected to Graphite server '+ hp)
    })

    socket.on('error', e => {
      log.error('Error connecting to Graphite: '+ e.message)
    })

    socket.on('close', () => {
      setTimeout(() => {
        log.info('Trying to reconnect to '+ hp)
        this.connect(options)
      }, options.reconnectInterval)
    })
  }

  send() {
    var now = new Date()
    var output = ''
    var mts = (now.getTime() / 1000 | 0)

    if(sending === true) {
      storage = {}
      return log.error('Skipping this batch!')
    }

    if(Object.keys(storage).length === 0)
      return

    sending = true

    for (var metric in storage) {
      if(typeof storage[metric] === 'number') {
        output += metric +'.'+ options.hostname
          +' '+ storage[metric] +' '+ mts +'\n'
      } else {
        let result = stats.calculate(storage[metric])
        for(var stat in result) {
          output += metric +'.'+ stat +'.'+ options.hostname
            +' '+ result[stat] +' '+ mts +'\n'
        }
     }
    }

    storage = {}

    if(socket.writable && output) {
      socket.write(output, 'utf8', () => {
        sending = false
        log.debug('Metrics sent to Graphite server:'+ util.fmlm(output))
      })
    }
  }

  add(metrics) {
    for (let fqn in metrics) {
      let value = metrics[fqn]
      let type = typeof value == 'number' ? 'c' : 's'

      if (type == 'c')
        this.count(value, fqn)
      else if (type == 's')
        this.stats(value, fqn)
      else
        log.warn('Invalid metric type '+ type)
    }
  }

  count(value, fqn) {
    storage[fqn] = storage[fqn] ? (storage[fqn] + value) : value
  }

  stats(arr, fqn) {
    if(!storage[fqn])
      storage[fqn] = []

    for(let i = 0; i < arr.length; i++) {
      stats.insert(arr[i], storage[fqn])
    }
  }
}

module.exports = Graphite
