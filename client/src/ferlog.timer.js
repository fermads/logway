
;(function() {

  function init(startNow) {
    this.timer = null;

    this.end = end;
    this.start = start;

    if(startNow)
      start();
    return this;
  }

  function start() {
    this.timer = Date.now();
    return this.timer;
  }

  function end() {
    if(!this.timer)
      return console && console.error('Timer not started');

    var result = Date.now() - this.timer;
    this.timer = null;

    return result;
  }

  return init();
})();