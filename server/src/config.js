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
    path: util.env.production ? '/export/logs/logui' : __dirname + '/../log'
  },

  metric: {

  },

  graphite: {
    host: '127.0.0.1',
    port: 231,
    reconnectInterval: util.env.production ? 100000 : 10000,
    sendInterval: util.env.production ? 60000 : 10000,
    maxValuesPerInterval: 1000000
  }
}

module.exports = Config