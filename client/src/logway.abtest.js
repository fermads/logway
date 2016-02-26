;(function (w) {
  var log = w.Logway.log

  function ABTest (metric) {
    if (!metric) log('metric is required')

    this.metric = metric
    this.result = null
    this.tests = {}

    this.setup = setup
    this.select = select
    this.lotery = lotery
    this.restore = restore
    this.clear = clear

    return this
  }

  function lotery () {
    var number = parseInt(Math.random() * 100, 10), value = 0

    for (var version in this.tests) {
      value += this.tests[version]

      if (number <= value) {
        return version
      }
    }

    return 'none'
  }

  function clear () {
    localStorage.removeItem('logway-' + this.metric)
  }

  function restore () {
    var storage = localStorage.getItem('logway-' + this.metric)

    if (!storage) {
      storage = this.lotery()
      localStorage.setItem('logway-' + this.metric, storage)
      log('Returning user for test "' + this.metric + '" with version "'
        + storage + '"')
    }
    else {
      log('New user for test "' + this.metric + '" with version "'
        + storage + '"')
    }

    return storage
  }

  function setup (tests, callback) {
    this.tests = tests
    this.result = this.restore()

    if (callback) {
      callback(this.result)
    }

    w.Logway.count(this.metric + '.' + this.result + '.start')

    return this.result
  }

  function select (option) {
    w.Logway.count(this.metric + '.' + this.result + '.' + option)
  }

  w.Logway.ABTest = ABTest
})(window)
