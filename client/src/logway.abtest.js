;(function (w) {
  var log = w.Logway.log

  function ABTest (metric) {
    if (!metric) log('metric is required')

    this.metric = metric
    this.result = null
    this.tests = {}

    this.add = add
    this.end = end
    this.start = start
    this.lotery = lotery

    return this
  }

  function add (version, percent, callback) {
    this.tests[version] = {
      percent: percent,
      callback: callback
    }
  }

  function lotery () {
    var number = parseInt(Math.random() * 100, 10), value = 0

    for (var version in this.tests) {
      value += this.tests[version].percent

      if (number <= value) {
        return version
      }
    }

    return 'none'
  }

  function start () {
    this.result = localStorage.getItem('logway-' + this.metric)

    if (!this.result) {
      this.result = this.lotery()
      localStorage.setItem('logway-' + this.metric, this.result)
      log('Returning user for test "' + this.metric + '" with version "'
        + this.result + '"')
    }
    else {
      log('New user for test "' + this.metric + '" with version "'
        + this.result + '"')
    }

    if (this.tests[this.result].callback) {
      this.tests[this.result].callback()
    }

    w.Logway.count(this.metric + '.' + this.result + '.start')

    return this.result
  }

  function end () {
    w.Logway.count(this.metric + '.' + this.result + '.end')
  }

  w.Logway.ABTest = ABTest
})(window)
