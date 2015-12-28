let os = require('os')
let net = require('net')
let Logger = require('../lib/logger')
let config = require('./config')
let storage = {}, socket, log, hp, options

class Metric {
  constructor() {
    log = new Logger('metric', config.logger)
    options = config.graphite
    hp = options.host +':'+ options.port

    options.hostname = os.hostname()

    setInterval(() => {
      this.send()
    }, options.sendInterval)

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

    for (var metric in storage) {
      output += metric +'.'+ options.hostname
        +' '+ storage[metric] +' '+ mts +'\n'
    }

    storage = {}

    if(socket.writable && output) {
      socket.write(output, 'utf8')
      log.debug('Sending metrics to Graphite server:\n\t'+
        output.replace(/\n[^$]/g, '\n\t'))
    }
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

      if(storage[fqn])
        storage[fqn] = storage[fqn] + value
      else
        storage[fqn] = value
    }
  }

  write(content) {
    log.info('Received content: '+ content)
    this.parse(content.toString())
  }
}

module.exports = Metric
/*let os = require('os')
let net = require('net')
let options, storage = {}, socket, log, hp,
  reconnectInterval, flushInterval, instance

class Metric {
  constructor(config, logger) {
    options = config
    log = logger || console
    reconnectInterval = options.reconnectInterval || 100000
    flushInterval = options.flushInterval || 60000

    if(!options.host || !options.port)
      return log.error('[metric] Host and port options are required')

    if(!options.prefix)
      return log.error('[metric] Prefix name is required')

    if(instance) // singleton
      return instance
    else
      instance = this

    options.hostname = os.hostname()
    hp = options.host +':'+ options.port

    setInterval(() => {
      this.flush()
    }, flushInterval)

    this.connect(options)
  }

  write(metrics) {
    console.log('writing...');
  }

  connect(options) {
    if(socket) {
      socket.destroy()
      socket = null
    }

    socket = new net.Socket(options.host)
    socket.connect(options.port, options.host)

    socket.on('connect', () => {
      log.info('[metric] Connected to '+ hp)
    })

    socket.on('error', e => {
      log.error('[metric] Error connecting to '+ hp +' - '+ e.message)
    })

    socket.on('close', () => {
      setTimeout(() => {
        log.info('[metric] Trying to reconnect to '+ hp)
        this.connect(options)
      }, reconnectInterval)
    })
  }

  sum(store) {
    var product = ''
    var lines = store.split('\n')

    if(lines.length === 0)
      return

    if(lines[0].indexOf('!') !== -1) {
      product = lines[0].split('!')[1] +'.';
      lines.shift();
    }

    for(var i = 0; i < lines.length; i++) {
      if(lines[i].indexOf(' ') === -1)
        continue;

      var parts = lines[i].split(' ');
      var fqn = product + parts[0];
      var value = parts[1];

      console.log(fqn, value);
      // add(fqn, value);
    }
  }
  flush() {
    var now = new Date()
    var output = ''
    var mts = (now.getTime() / 1000 | 0)

    for (var metric in storage) {
      output += options.prefix +'.'+ metric +'.'+ options.hostname
        +' '+ storage[metric] +' '+ mts +'\n'
    }

    storage = {}
    this.send(output)
  }

  put(fqn, value) {
    this.add(fqn, value, true)
  }

  add(fqn, value, replace) {
    if(!fqn || value === undefined || value === 0)
      return

    if(storage[fqn] && !replace)
      storage[fqn] += value
    else
      storage[fqn] = value
  }

  send(metrics) {
    if(socket.writable && metrics) {
      socket.write(metrics, 'utf8')
    }
  }
}

module.exports = Metric*/