let Logger = require('../lib/logger')
let config = require('./config')
let log, options, storage = []

class Logstash {
  constructor() {
    log = new Logger('graphite', config.logger)
    options = config.logstash
  }

  add(lines) {
    for(var i = 0; i < lines.length ; i++) {
      log.debug('Adding line to send to logstash '+ lines[i])
      storage.push(lines[i])
    }
  }

}
module.exports = Logstash