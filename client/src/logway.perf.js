;(function (w) {
  var t = w.performance && w.performance.timing
  var log = w.Logway.log
  var percent = 10

  init()

  function calculate () {
    var perfs = {
      // to understand this, see:
      // http://www.w3.org/TR/navigation-timing/timing-overview.png
      'redirect': t.redirectEnd - t.redirectStart,
      'fetchfromcache': t.domainLookupStart - t.fetchStart,
      'domainlookup': t.domainLookupEnd - t.domainLookupStart,
      'connection': t.connectEnd - t.connectStart,
      'request': t.responseStart - t.requestStart,
      'response': t.responseEnd - t.responseStart,
      'dominteractive': t.domInteractive - t.domLoading,
      'domcomplete': t.domComplete - t.domLoading,
      'loadcomplete': t.loadEventEnd - t.loadEventStart,
      'networklatency': t.responseEnd - t.fetchStart,
      'pageparse': t.loadEventEnd - t.responseEnd,
      'pagefullload': t.loadEventEnd - t.navigationStart
    }

    return perfs
  }

  function init () {
    if (!t) return log('Performance API not supported by this browser')

    if (Math.random() * 100 > percent) {
      return log('This user not in the ' + percent + '%')
    }

    w.addEventListener('load', function () {
      setTimeout(send, 0)
    })
  }

  function send () {
    var result = calculate()

    if (result.pagefullload === 0) {
      return log('Could not calculate performance.timing')
    }

    for (var item in result) {
      w.Logway.stats('perf.' + item, result[item])
    }
  }
})(window)
