let http = require('http')
let url = require('url')
let fs = require('fs')
let os = require('os')
let path = require('path')
let Service = require('./service')
let Logger = require('../lib/logger')
let config = require('./config')
let log, service, id, healthOk = true

class Server {

  constructor() {
    id = process.env.id
    log = new Logger('server'+ id, config.logger)
    service = new Service()
    setInterval(this.health, config.worker.verifyFreeMemInterval)
    return this.start()
  }

  start() {
    let path

    let server = http.createServer((req, res) => {
      path = url.parse(req.url).pathname
      this.router(req, res, path)
    }).listen(config.server.httpPort)

    return server
  }

  health() {
    let freememOk = os.freemem() > config.worker.minFreeMemForNewRequests

    if(!freememOk && healthOk) {
      healthOk = false
      log.warn('Low free memory. Stop accepting new requests')
    }
    else if(freememOk && !healthOk) {
      healthOk = true
      log.info('Free memory is OK now. Accepting new requests')
    }
  }

  router(req, res, path) {
    if(!healthOk)
      this.unavailable(res)
    else if(req.method == 'OPTIONS')
      this.cors(res)
    else if(path == '/v1')
      this.service(req, res)
    else if(path == '/health-check')
      this.ok(res)
    else if(path == '/' || path.indexOf('/ferlog.') === 0)
      this.file(res, path == '/' ? '/ferlog.html' : path)
    else
      this.error(res, path)
  }

  mime(extension) {
    var types = {
      '.html': 'text/html',
      '.js': 'text/javascript'
    }
    return {'content-type' : types[extension]}
  }

  file(res, filename) {
    let extension = path.extname(filename)
    let fullpath = config.server.basePath + filename

    fs.readFile(fullpath, 'utf8', (error, data) => {
      if (error)
        return this.error(res, filename)

      res.writeHead(200, this.mime(extension))
      res.end(data)
    })
  }

  service(req, res) {
    this.response(req, content => {
      service.write(content)
    })
    this.ok(res)
  }

  error(res, path) {
    res.writeHead(404)
    res.end('404 not found: '+ path)
    log.debug('404 not found: '+ path)
  }

  unavailable(res) {
    res.writeHead(503)
    res.end('OK')
  }

  ok(res) {
    res.writeHead(200)
    res.end('OK')
  }

  cors(res) {
    var headers = {
      'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Credentials': false,
      // 'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Headers':
        'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
    }

    res.writeHead(200, headers)
    res.end()
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
