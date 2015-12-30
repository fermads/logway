;(function(w, d) {
  var t = w.performance.timing;

  init();

  function calculate() {
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
    };

    return perfs;
  }

  function init() {
    if(!t) return;

    w.addEventListener('load', function() {
      setTimeout(sendPerfInfo,0);
    });
  }

  function sendPerfInfo() {
    var result = calculate();

    for(var item in result) {
      Ferlog.stats('performance.'+ item, result[item]);
      // console.log('performance.'+ item, result[item]);
    }
  }
})(window, document);
