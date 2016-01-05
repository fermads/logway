;(function(w) {

  var timer = null;
  var log = w.Ferlog.log;

  function Timer(startNow) {
    this.end = end;
    this.start = start;

    if(startNow)
      start();
    return this;
  }

  function start() {
    timer = Date.now();
    return timer;
  }

  function end(metric) {
    if(!timer)
      return log('Timer not started');

    if(!metric)
      return log('Metric name is required');

    var result = Date.now() - timer;
    timer = null;

    w.Ferlog.stats(metric, result);

    return result;
  }

  w.Ferlog.Timer = Timer;

})(window);