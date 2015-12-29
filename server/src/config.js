let util = require('./util')

let Config = {
  master: {
    workers: util.os.cpus // number of workers
  },

  worker: {
    http: {
      port: 80
    },

    https: {
      port: 443,
      cert: ''
    }
  },

  logger: {
    console: util.env.production ? false : true,
    debug: util.env.production ? false : true,
    path: util.env.production ? '/export/logs/ferlog' : __dirname + '/../log'
  },

  metric: {
    flushInterval: util.env.production ? 10000 : 5000
  },

  graphite: {
    type: 'tcp', // TO-DO: implement
    host: '127.0.0.1',
    port: 231,
    reconnectInterval: util.env.production ? 100000 : 10000,
    flushInterval: util.env.production ? 60000 : 10000,
    maxValuesPerInterval: 1000000
  }
}

module.exports = Config