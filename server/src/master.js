let cluster = require('cluster')
let Worker = require('./worker')
let Logger = require('../lib/logger')
let Graphite = require('./graphite')
let Logstash = require('./logstash')
let config = require('./config')

let log, graphite, logstash

class Master {

  constructor() {
    if (cluster.isMaster) {
      log = new Logger('master', config.logger)
      graphite = new Graphite()
      logstash = new Logstash()
      this.bind()
      this.start()
    }
    else {
      new Worker()
    }
  }

  bind() {
    cluster.on('exit', (worker, code) => {
      log.fatal('Worker '+ worker.id +' pid(' + worker.process.pid
        + ') died with code ' + code)

      log.info('Restarting worker '+ worker.id +'...')
      this.fork(worker.id)
    });
  }

  start() {
    for (let i = 0; i < config.master.workers; i++) {
      this.fork(i+1)
    }
  }

  fork(id) {
    let worker = cluster.fork({ id: id })

    worker.on('message', content => {
      if(content.metrics)
        graphite.add(content.metrics)

      if(content.weblogs)
        logstash.add(content.weblogs)
    })
  }
}

module.exports = Master