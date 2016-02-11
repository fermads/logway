let os = require('os')

let SEC = 1000
let GB = 1073741824
let PROD = !Boolean(process.env.DEVELOPMENT)
let CPUS = os.cpus().length
let BASE = __dirname + '/../..'

let Config = {
  master: {
    workers: CPUS // number of workers
  },

  worker: {
    verifyFreeMemInterval: 5*SEC,
    minFreeMemForNewRequests: 0.5*GB
  },

  server: {
    httpPort: 80,
    httpsPort: 443,
    httpsKeys: {
      key: BASE + '/server/etc/key/logway-key.pem',
      cert: BASE + '/server/etc/key/logway-cert.pem'
    },
    basePath: BASE + '/client/src',
    mimeTypes: {
      '.html': 'text/html',
      '.js': 'text/javascript'
    }
  },

  logger: {
    console: !PROD,
    debug: !PROD,
    path: PROD ? '/export/logs/logway' : BASE + '/server/log'
  },

  service: {
    maxLinesPerPost: 100,
    flushInterval: PROD ? 10*SEC : 5*SEC
  },

  logstash: {
    enabled: true,
    type: 'tcp',
    host: '127.0.0.1',
    port: '9000',
    reconnectInterval: PROD ? 60*SEC : 1*SEC,
    flushInterval: PROD ? 60*SEC : 10*SEC,
    maxLogsPerInterval: 100000
  },

  graphite: {
    enabled: true,
    type: 'tcp', // TO-DO: implement
    host: '127.0.0.1',
    port: 231,
    reconnectInterval: PROD ? 60*SEC : 1*SEC,
    flushInterval: PROD ? 60*SEC : 10*SEC,
    maxMetricsPerInterval: 1000000
  }
}

module.exports = Config