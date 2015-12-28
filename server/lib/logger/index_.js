class Logger {
  constructor() {
    console.debug = console.log
    console.fatal = console.log
    return console
  }
}

module.exports = Logger