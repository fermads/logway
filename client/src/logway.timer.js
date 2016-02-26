;(function (w) {
  var log = w.Logway.log

  function Timer (metric, startNow) {
    if (!metric) return log('Metric name is required')

    this.timer = null
    this.metric = metric
    this.end = end
    this.start = start

    if (startNow) start()

    return this
  }

  function start () {
    this.timer = Date.now()
    return this.timer
  }

  function end () {
    if (!this.timer) return log('Timer not started')

    var result = Date.now() - this.timer
    this.timer = null

    w.Logway.stats(this.metric, result)

    return result
  }

  w.Logway.Timer = Timer
})(window)
