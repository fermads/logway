;(function (w) {
  var t = w.performance && w.performance.timing
  var log = w.Logway.log
  var percent = 10

  function calculate () {
    var perfs = {
      // explanation: http://www.w3.org/TR/navigation-timing/timing-overview.png
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

  function run (p) {
    if (!t) {
      return log('Performance API not supported by this browser')
    }

    percent = p || percent

    if (Math.random() * 100 > percent) {
      return log('This user is not in the ' + percent + '%')
    }

    // executed before onload
    if (document.readyState === 'complete') {
      send()
    }
    else {
      w.addEventListener('load', function () {
        // sometimes performance.timing is not ready. setTimeout fix it.
        setTimeout(send, 0)
      })
    }
  }

  function send () {
    var result = calculate()

    for (var item in result) {
      // fix browsers that show crazy numbers on performance timing
      if (result[item] > 0 && result[item] < 300000) { // 5 mins
        w.Logway.stats('perf.' + item, result[item])
      }
    }
  }

  w.Logway.Perf = {
    run: run
  }
})(window)
