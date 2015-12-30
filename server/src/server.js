let http = require('http')
let url = require('url')
let fs = require('fs')
let Metric = require('./metric')
let Logger = require('../lib/logger')
let Weblog = require('./weblog')
let config = require('./config')
let log, metric, weblog

class Server {
  constructor() {
    log = new Logger('server', config.logger)
    metric = new Metric()
    weblog = new Weblog()
    return this.start()
  }

  start() {
    let path

    let server = http.createServer((req, res) => {
      path = url.parse(req.url).pathname
      this.router(req, res, path)
    }).listen(80)

    return server
  }

  cors(res) {
    var headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Credentials': false,
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Headers':
        'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
    }

    res.writeHead(200, headers)
    res.end()
  }

  router(req, res, path) {
    if(req.method == 'OPTIONS')
      this.cors(res)
    else if(path == '/metric')
      this.metric(req, res)
    else if(path == '/weblog')
      this.weblog(req, res)
    else if(path == '/health-check')
      this.ok(res)
    else if(path == '/')
      this.file(res, 'ferlog.html', 'text/html')
    else if(path == '/ferlog.js')
      this.file(res, 'ferlog.js', 'text/javascript')
    else if(path == '/ferlog.perf.js')
      this.file(res, 'ferlog.perf.js', 'text/javascript')
    else if(path == '/ferlog.logger.js')
      this.file(res, 'ferlog.logger.js', 'text/javascript')
    else
      this.error(res, path)
  }

  file(res, filename, contentType) {
    fs.readFile(__dirname +'/../../client/src/' + filename, 'utf8',
      (error, data) => {
      if (error)
        return error(res, error)

      res.writeHead(200, {'content-type' : contentType})
      res.end(data)
    })
  }

  metric(req, res) {
    this.response(req, content => {
      metric.write(content)
    })
    this.ok(res)
  }

  weblog(req, res) {
    this.response(req, content => {
      weblog.write(content)
    })
    this.ok(res)
  }

  error(res, path) {
    res.writeHead(404)
    res.end('404 not found: '+ path)
    log.debug('404 not found: '+ path)
  }

  ok(res) {
    res.writeHead(200)
    res.end('OK')
  }

  response(req, callback) {
    let chunks = []

    req.on('data', function(chunk){
      chunks.push(chunk)
    })

    req.on('end', function() {
      callback(Buffer.concat(chunks))
    })
  }
}

module.exports = Server
