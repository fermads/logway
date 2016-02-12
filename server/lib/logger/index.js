
let fs = require('fs')

const colors = {
  trace : '\x1b[37m',
  debug : '\x1b[36m',
  info  : '\x1b[32m',
  warn  : '\x1b[33m',
  error : '\x1b[31m',
  fatal : '\x1b[35m',
  reset : '\x1b[39m'
}

const levels = {
  trace : 'TRACE',
  debug : 'DEBUG',
  info  : 'INFOR',
  warn  : 'WARNG',
  error : 'ERROR',
  fatal : 'FATAL'
}

var instances = {}

class Log {
  constructor(logname, config) {
    if(instances[logname])
      return instances[logname]
    else
      instances[logname] = this

    this.options = config

    if(!logname || logname.match(/\W/) || logname.length > 8)
      throw Error('Log file suffix is required, must match /[a-zA-Z_0-9]/'
        +' and have length <= 8')

    if(!this.options.path && !this.options.console)
      this.options.console = true

    this.label = this.pads(logname, 8)
    this.suffix = logname

    if(this.options.path)
      this.exists(this.options.path)
  }

  exists(path) {
    if(path) {
      try {
        fs.statSync(path)
      }
      catch(err) {
        if (err.code == 'ENOENT')
          console.log('Log path does not exist', path)
        throw err
      }
    }
  }

  color(level, message) {
    return colors[level] + message + colors.reset
  }

  padz(s, v) {
    return ('00000'+ s).substr(-v)
  }

  pads(s, v) {
    return (s +'       ').substring(0, v)
  }

  put(line, level) {
    let now = new Date()
    level = level || 'info'
    line = this.lineDate(now) +' '+ levels[level] +' '+ line

    if(this.options.console)
      console.log(this.label +' -> ' + this.color(level, line))

    if(this.options.path)
      this.write(line, now)
  }

  debug(line) {
    if(this.options.debug)
      this.put(line, 'debug')
  }

  fatal(line) {
    this.put(line, 'fatal')
    if(!this.options.console) // also write to console on fatal error
      console.log(line)
  }

  trace(line) {
    let stack = new Error().stack.split('\n').slice(2, 10).join('\n')
    this.put(line +'\n'+ stack, 'trace')
  }

  info(line) {
    this.put(line, 'info')
  }

  warn(line) {
    this.put(line, 'warn')
  }

  error(line) {
    this.put(line, 'error')
  }

  fileDate(now) { // date for log filename
    return this.lineDate(now).split(' ')[0]
  }

  lineDate(now) { // date for log line
    now.setHours(now.getHours() - now.getTimezoneOffset() / 60)
    return now.toISOString().replace('T', ' ').replace('Z', '')
  }

  write(line, now) {
    if(this.today != now.getDate()) { // create a new log file every day
      this.today = now.getDate()

      if(this.file) // end the stream before creating a new one
        this.file.end()

      this.file = fs.createWriteStream(this.options.path
        +'/'+ this.fileDate(now) +'-'
        + this.suffix +'.log', { flags:'a' })

      this.file.on('error', err => {
        throw Error(err)
      })
    }

    this.file.write(line +'\n', 'utf8')
  }
}

module.exports = Log