/* global Ferlog */
;(function(w) {

  var u, p, n;

  function init() {
    u = url(location.href);
    p = navigator.platform;
    n = navinfo();

    w.addEventListener('error', function(e) {
      // log('trace '+ p +' '+ n[0] +' '+ n[1] +' '+ u +' '+
      //   url(e.filename) +' '+ e.lineno +' '+ e.error.message);
      trace(url(e.filename) +' '+ e.lineno +' '+ e.error.message);

      return false;
    });

    this.log = log;
    this.fatal = fatal;
    this.error = error;
    this.warn = warn;
    this.info = info;
    this.debug = debug;
    this.trace = trace;

    return this;
  }

  function url(u) {
    return u.replace('http://', '').replace('https://', '');
  }

  function log(level, m) {
    var l = level || 'info';
    Ferlog.log(l +' '+ p +' '+ n[0] +' '+ n[1] +' '+ u +' '+ m);
  }

  function fatal(m) {
    log('fatal', m);
  }

  function error(m) {
    log('error', m);
  }

  function warn(m) {
    log('warn', m);
  }

  function info(m) {
    log('info', m);
  }

  function debug(m) {
    log('debug', m);
  }

  function trace(m) {
    log('trace', m);
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
    return M;
  }

  return init();

})(window);
