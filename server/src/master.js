let os = require('os')
let cluster = require('cluster')
let Worker = require('./worker')
let Logger = require('../lib/logger')
let config = require('./config')
let log, cpus

class Master {

  constructor() {
    log = new Logger('master', config.logger)
    cpus = os.cpus().length
    this.start()
    this.bind()
  }

  bind() {
    cluster.on('exit', (worker, code) => {
      log.fatal('Worker '+ worker.id +' pid(' + worker.process.pid
        + ') died with code ' + code)

      log.info('Restarting worker '+ worker.id +'...')
      cluster.fork({ id: worker.id })
    });
  }

  start() {
    if (cluster.isMaster)
      this.fork()
    else
      new Worker()
  }

  fork() {
    for (let i = 0; i < config.master.workers; i++) {
      cluster.fork({ id: i+1 });
    }
  }
}

module.exports = new Master()