// colocar um rate limit no client maxsend = 100 por exemplo

;(function(w, d) {
  var t = w.performance.timing;
  var perfs = {
    'redirect': t.redirectEnd - t.redirectStart,
    'fetch from cache': t.domainLookupStart - t.fetchStart,
    'domain lookup': t.domainLookupEnd - t.domainLookupStart,
    'connection': t.connectEnd - t.connectStart,
    'request': t.responseStart - t.requestStart,
    'response': t.responseEnd - t.responseStart,
    'domInteractive': t.domInteractive - t.domLoading,
    'domContentLoaded': t.domContentLoadedEventEnd - t.domContentLoadedEventStart,
    'domComplete': t.domComplete - t.domLoading,
    'load complete': t.loadEventEnd - t.loadEventStart,
    'all network latency': t.responseEnd - t.fetchStart,
    'page parse': t.loadEventEnd - t.responseEnd,
    'page full load': t.loadEventEnd - t.navigationStart,
    'js heap size': w.performance.memory.usedJSHeapSize
  };

  init();

  function init() {
    d.addEventListener('load', function() {
      sendPerfInfo();
    });
  }

  function navinfo(){
    var ua = navigator.userAgent, tem,
      M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
      tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
      tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
      if(tem !== null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem = ua.match(/version\/(\d+)/i)) !== null) M.splice(1, 1, tem[1]);
    return M.join(' ');
  }

  function sendPerfInfo() {
    var info = navinfo();
    info = info.replace(/\./g, '_').replace(' ', '.');

    for(var item in perfs) {
      w[globvar].stats('performance.'+ info +'.'+ item, perfs[item]);
      // console.log(item +'='+ perfs[item]);
    }
  }

})(window, document);


/*var t = performance.timing;
var perfs = {
  'redirect': t.redirectEnd - t.redirectStart,
  'fetch from cache': t.domainLookupStart - t.fetchStart,
  'domain lookup': t.domainLookupEnd - t.domainLookupStart,
  'connection': t.connectEnd - t.connectStart,
  'request': t.responseStart - t.requestStart,
  'response': t.responseEnd - t.responseStart,
  'domInteractive': t.domInteractive - t.domLoading,
  'domContentLoaded': t.domContentLoadedEventEnd - t.domContentLoadedEventStart,
  'domComplete': t.domComplete - t.domLoading,
  'load complete': t.loadEventEnd - t.loadEventStart,
  'all network latency': t.responseEnd - t.fetchStart,
  'page parse': t.loadEventEnd - t.responseEnd,
  'page full load': t.loadEventEnd - t.navigationStart,
  'js heap size': performance.memory.usedJSHeapSize
}

for(var item in perfs) {
  console.log(item +'='+ perfs[item])
}*/


window.onerror = function myErrorHandler() {
  console.log(arguments);
  console.log(navigator.platform, navinfo(), arguments[2], arguments[3], arguments[1], arguments[0]);
    // console.log(arguments[4].stack)
    // var s = arguments[4]
    // console.log(s.stack)
    return false;
};
