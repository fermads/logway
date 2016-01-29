;(function(w) {

  var timer = null;
  var log = w.Logway.log;

  function Timer(metric, startNow) {
    if(!metric)
      return log('Metric name is required');

    this.metric = metric;
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

  function end() {
    if(!timer)
      return log('Timer not started');

    var result = Date.now() - timer;
    timer = null;

    w.Logway.stats(this.metric, result);

    return result;
  }

  w.Logway.Timer = Timer;

})(window);