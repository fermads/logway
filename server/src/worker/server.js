let config = require('../config')
let http = require('http')
let https = require(config.server.useHttp2 ? 'http2' : 'https')
let url = require('url')
let fs = require('fs')
let os = require('os')
let path = require('path')
let Service = require('./service')
let Logger = require('../../lib/logger')

let log, service, id, healthOk = true, keys

class Server {

  constructor() {
    id = process.env.id
    log = new Logger('server'+ id, config.logger)
    service = new Service()
    setInterval(this.health, config.worker.verifyFreeMemInterval)
    keys = this.getHttpsKeys()
    this.start()
  }

  getHttpsKeys() {
    try {
      return {
        key: fs.readFileSync(config.server.httpsKeys.key),
        cert: fs.readFileSync(config.server.httpsKeys.cert)
      }
    }
    catch(e) {
      log.warn('HTTPS keys not found. HTTPS server NOT running.')
    }
  }

  start() {
    let path

    http.createServer((req, res) => {
      path = url.parse(req.url).pathname
      this.router(req, res, path)
    }).listen(config.server.httpPort)

    if(keys) {
      https.createServer(keys, (req, res) => {
        path = url.parse(req.url).pathname
        this.router(req, res, path)
      }).listen(config.server.httpsPort)
    }
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
    else if(path == '/' || path.indexOf('/logway.') === 0)
      this.file(res, path == '/' ? '/logway.html' : path)
    else
      this.error(res, path)
  }

  file(res, filename) {
    let extension = path.extname(filename)
    let fullpath = config.server.basePath + filename

    fs.readFile(fullpath, 'utf8', (error, data) => {
      if (error)
        return this.error(res, filename)

      res.writeHead(200, config.server.mimeTypes[extension])
      res.end(data)
    })
  }

  service(req, res) {
    // ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
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
    res.end('service unavailable')
  }

  ok(res) {
    res.writeHead(200)
    res.end('ok')
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
