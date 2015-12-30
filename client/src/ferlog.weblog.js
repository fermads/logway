;(function(w, d) {

  init();

  function init() {
    w.addEventListener('error', function(e) {
      var n = navinfo();
      // store errors and send them at once

      console.log('error', navigator.platform, n[0], n[1],
        url(location.href), url(e.filename), e.lineno, e.error.message);

      return false;
    });
  }

  function url(u) {
    return u.replace('http://', '').replace('https://', '');
  }

  /*var level = {
    'FATAL' => 900,
    'ERROR' => 850,
    'WARN' => 700,
    'INFO' => 500,
    'DEBUG' => 300,
    'TRACE' => 100,
  }*/

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
    return M;
  }

})(window, document);
