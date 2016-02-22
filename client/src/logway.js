;(function (w, d) {
  var delay = opt('delay', 1000)
  var prefix = opt('prefix', '')
  var host = opt('host', '//' + location.hostname + '/v1')
  var debug = opt('debug', false)
  var timeout = opt('timeout', 500)
  var regex = /^[a-z0-9_.]+$/
  var tid = 0, maxSize = 200, sentLimit = 10, sent = 0, metrics = {}, logs = []

  init()

  function init () {
    log('Using options:'
      + '\n\tprefix : ' + prefix
      + '\n\thost   : ' + host
      + '\n\ttimeout: ' + timeout)

    if (!w.Logway) w.Logway = {}
    if (!prefix) return log('Prefix is required')
    if (prefix) prefix += '.'
  }

  function opt (prop, defaultValue) {
    var sel = d.querySelector('[data-logway-' + prop + ']')
    return sel ? sel.getAttribute('data-logway-' + prop) : defaultValue
  }

  function count (fqn, value, reset) {
    if (value === undefined) {
      value = 1
    }
    store(fqn, value, 'c', reset)
  }

  function stats (fqn, value) {
    store(fqn, value, 's')
  }

  function validate (fqn, value, type) {
    if (typeof value === 'number'
        && ((value !== 0 && type === 'c') || type === 's')
        && value <= 9e+20
        && regex.test(fqn)) {
      return true
    }

    log('Skipping metric ' + fqn + ' ' + value)
    return false
  }

  function store (fqn, value, type, reset) {
    if (!validate(fqn, value, type)) {
      return
    }

    if (metrics[fqn] && type === 'c' && !reset) {
      metrics[fqn].value += value
    }
    else {
      metrics[fqn] = {
        value: value,
        type: type
      }
    }

    if (tid === 0) {
      tid = setTimeout(send, delay)
    }

    log('Storing: ' + type + ' ' + prefix + fqn + ' ' + value)
  }

  function flush () {
    var output = ''
    var size = Object.keys(metrics).length

    if (logs.length + size > maxSize) return log('Too many lines')

    if (prefix && size > 0) output = 'p ' + prefix + '\n'

    for (var fqn in metrics) {
      output += metrics[fqn].type + ' ' + fqn + ' ' + metrics[fqn].value + '\n'
    }

    metrics = {}
    output += logs.join('\n')
    logs = []

    return output
  }

  function log (text) {
    if (debug && console && console.log) {
      console.log('[logway]', text)
    }
  }

  function send () {
    if (++sent > sentLimit) {
      tid = 0
      return log('Send limit exceeded')
    }

    var req = new XMLHttpRequest()
    req.open('POST', host)
    req.ontimeout = function () {
      log('request timed out')
    }
    req.timeout = timeout
    req.setRequestHeader('Content-Type', 'text/plain')

    var all = flush()
    req.send(all)
    log('Sending...\n\t' + all.replace(/\n$/, '').replace(/\n/g, '\n\t'))

    tid = 0
  }

  function write (msg) {
    if (msg !== undefined) {
      logs.push('l ' + msg)
    }

    if (tid === 0) {
      tid = setTimeout(send, delay)
    }

    log('Storing: l ' + msg)
  }

  w.Logway.count = count
  w.Logway.stats = stats
  w.Logway.write = write
  w.Logway.log = log
})(window, document)
