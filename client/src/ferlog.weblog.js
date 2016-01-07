;(function(w) {

  var u, p, n;
  var log = w.Ferlog.log;

  function init() {
    u = url(location.href);
    p = navigator.platform;
    n = navinfo();

    bind();

    this.write = write;
    this.fatal = fatal;
    this.error = error;
    this.warn = warn;
    this.info = info;
    this.debug = debug;
    this.trace = trace;

    return this;
  }

  function bind() {
    w.addEventListener('error', function(e) {
      trace(url(e.filename) +' '+ e.lineno +' '+ e.error.message);
      return false;
    });
  }

  function url(u) {
    return u.replace('http://', '').replace('https://', '');
  }

  function write(level, m) {
    var l = level || 'info';
    if(!m)
      return log('Log message is require');
    w.Ferlog.write(l +' '+ p +' '+ n +' '+ u +' '+ m);
  }

  function fatal(m) {
    write('fatal', m);
  }

  function error(m) {
    write('error', m);
  }

  function warn(m) {
    write('warn', m);
  }

  function info(m) {
    write('info', m);
  }

  function debug(m) {
    write('debug', m);
  }

  function trace(m) {
    write('trace', m);
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

  return init();

})(window);
