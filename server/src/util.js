let os = require('os')

class Util {

  constructor() {
    this.setTime()
    this.setEnv()
    this.setOs()
  }

  setEnv() {
    this.env = {}
    this.env.development = Boolean(process.env.DEVELOPMENT)
    this.env.production = !this.env.development
    this.env.name = this.env.production ? 'production' : 'development'
  }

  setTime() {
    this.time = {}
    this.time.seconds = this.time.second = 1000
    this.time.minutes = this.time.minute = 60000
    this.time.hours = this.time.hour = 3600000
    this.time.days = this.time.day = 86400000
  }

  setOs() {
    this.os = {}
    this.os.cpus = os.cpus().length
  }

  isObject(obj) {
    return typeof obj == 'object' && obj !== null && obj.constructor == Object
  }

  fmlm(content) {
    return '\n            '+
      content.toString()
        .replace(/\n$/, '')
        .replace(/\n/g, '\n            ')
  }
}

module.exports = new Util()
