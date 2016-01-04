let util = require('./util')

let SEC = 1000
let GB = 1073741824

let Config = {
  master: {
    workers: util.os.cpus // number of workers
  },

  worker: {
    verifyHealthInterval: 5*SEC,
    minFreeMemForNewRequests: 2.5*GB,

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

  service: {
    maxLinesPerPost: 100,
    flushInterval: util.env.production ? 10*SEC : 5*SEC
  },

  logstash: {

  },

  graphite: {
    type: 'tcp', // TO-DO: implement
    host: '127.0.0.1',
    port: 231,
    reconnectInterval: util.env.production ? 10*SEC : 1*SEC,
    flushInterval: util.env.production ? 60*SEC : 10*SEC,
    maxValuesPerInterval: 1000000
  }
}

module.exports = Config