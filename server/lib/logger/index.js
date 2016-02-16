let fs = require('fs')
let os = require('os')
let util = require('util')

const levels = {
  trace: { color: '\x1b[37m', text: 'TRACE' },
  debug: { color: '\x1b[36m', text: 'DEBUG' },
  info: { color: '\x1b[32m', text: 'INFOR' },
  warn: { color: '\x1b[33m', text: 'WARNG' },
  error: { color: '\x1b[31m', text: 'ERROR' },
  fatal: { color: '\x1b[35m', text: 'FATAL' }
}

/*
var options = {
  debug: false | true,
  host: false | string | true = os.hostname(),
  name: string,
  printname: false | true
  console: true | false
  path: false | string
}
*/
let instances = {}

class Logger {
  constructor (name, config) {
    if (instances[name])
      return instances[name]
    else
      instances[name] = this

    this.setup(name, config)
  }

  setup (name, config) {
    if (!name || name.match(/\W/) || name.length > 8) {
      throw Error('Log name is required, must match /[a-zA-Z0-9_]/'
        + ' and have length <= 8')
    }

    this.console = config.console || true
    this.verbose = config.debug || false
    this.host = config.host === true ? ' ' + os.hostname() : ''
    this.path = config.path
    this.label = this.pads(name, 8)

    this.name = name

    if (!this.path && !this.console)
      this.console = true

    if (this.path)
      this.exists(this.path)
  }

  exists (path) {
    if (path) {
      try {
        fs.statSync(path)
      }
      catch (err) {
        if (err.code === 'ENOENT')
          console.log('Log path does not exist', path)
        throw err
      }
    }
  }

  pads (s, v) {
    return (s + '       ').substring(0, v)
  }

  parseArgs (args) {
    // fast common case
    if (args.length === 1 && typeof args[0] === 'string')
      return args[0]

    var arr = Array.prototype.slice.call(args)

    for (var i = 0; i < arr.length; i++) {
      if (typeof arr[i] === 'object' || arr[i] === undefined)
        arr[i] = util.inspect(arr[i])
    }

    return arr.join(' ')
  }

  put (args, level) {
    let line = this.parseArgs(args)
    let now = new Date()

    level = level || 'info'
    line = this.lineDate(now) + ' ' + levels[level].text + this.host
      + ' ' + line

    if (this.console)
      console.log(this.label + ' -> ' + levels[level].color + line + '\x1b[39m')

    if (this.path)
      this.write(line, now)
  }

  debug () {
    if (this.verbose)
      this.put(arguments, 'debug')
  }

  fatal () {
    this.put(arguments, 'fatal')
    if (!this.console) // also write to console on fatal error
      console.log(this.parseArgs(arguments))
  }

  trace () {
    let stack = new Error().stack.split('\n').slice(2, 10).join('\n')
    arguments[arguments.length++] = '\n' + stack
    this.put(arguments, 'trace')
  }

  info () {
    this.put(arguments, 'info')
  }

  warn () {
    this.put(arguments, 'warn')
  }

  error () {
    this.put(arguments, 'error')
  }

  fileDate (now) { // date for log filename
    return this.lineDate(now).split(' ')[0]
  }

  lineDate (now) { // date for log line
    now.setHours(now.getHours() - now.getTimezoneOffset() / 60)
    return now.toISOString().replace('T', ' ').slice(0, -1)
  }

  write (line, now) {
    if (this.today !== now.getDate()) { // create a new log file every day
      this.today = now.getDate()

      if (this.file) // end the stream before creating a new one
        this.file.end()

      this.file = fs.createWriteStream(this.path
        + '/' + this.fileDate(now) + '-'
        + this.name + '.log', { flags: 'a' })

      this.file.on('error', err => {
        throw Error(err)
      })
    }

    this.file.write(line + '\n', 'utf8')
  }
}

module.exports = Logger
