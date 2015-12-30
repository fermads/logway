// colocar um rate limit no client maxsend = 100 por exemplo

;(function(w, d) {
  var tid = 0;
  var storage = {};
  var delay = opt('delay', 1000);
  var prefix = opt('prefix', '');
  var host = opt('host', 'http://ferlog.uol.com.br/metric');
  var debug = opt('debug', false);
  var globvar = opt('global', 'Ferlog');
  var timeout = opt('timeout', 500);
  var regex = /^[a-z0-9_.]+$/;
  var limit = 10, sent = 0;

  init();

  function init() {
    log('Using options:'
      +'\n\tprefix : '+ prefix
      +'\n\thost   : '+ host
      +'\n\ttimeout: '+ timeout
      +'\n\tglobal : '+ globvar);

    if(!w[globvar])
      w[globvar] = {};

    if(!prefix)
      return log('Prefix is required');

    if(prefix)
      prefix += '.';
  }

  function opt(prop, defaultValue) {
    var sel = d.querySelector('[data-ferlog-'+ prop +']');
    return sel ? sel.getAttribute('data-ferlog-'+ prop) : defaultValue;
  }

  function count(fqn, value, reset) {
    store(fqn, value, 'c', reset);
  }

  function stats(fqn, value) {
    store(fqn, value, 's');
  }

  function validate(fqn, value, type) {
    if(typeof value == 'number'
        && ((value !== 0 && type == 'c') || type == 's')
        && value <= 9e+20
        && regex.test(fqn))
      return true;

    log('Skipping metric '+ fqn +' '+ value);
    return false;
  }

  function store(fqn, value, type, reset) {
    if(!validate(fqn, value, type))
      return;

    if(storage[fqn] && type == 'c' && !reset) {
      storage[fqn].value += value;
    }
    else {
      storage[fqn] = {
        value: value,
        type: type
      };
    }

    if(tid === 0)
      tid = setTimeout(send, delay);

    log('Storing: '+ prefix + fqn +' '+ value +' '+ type);
  }

  function flush() {
    var output = '';

    if(prefix) {
      output = '!'+ prefix +'\n';
    }

    for(var fqn in storage) {
      output += fqn +' '+ storage[fqn].value +' '+ storage[fqn].type +'\n';
    }

    storage = {};
    return output;
  }

  function log(text) {
    if(debug && console && console.log)
      console.log('['+ globvar +'] '+ text);
  }

  function send() {
    if(++sent > limit) {
      tid = 0;
      return log('Rate limit exceeded');
    }

    var req = new XMLHttpRequest();
    req.open('POST', host);
    req.ontimeout = function () {
      log('request timed out');
    };
    req.timeout = timeout;
    req.setRequestHeader('Content-Type', 'text/plain');

    var metrics = flush();
    req.send(metrics);
    log('Sending...\n\t'+ metrics.replace(/\n$/, '').replace(/\n/g, '\n\t'));

    tid = 0;
  }

  w[globvar].count = count;
  w[globvar].stats = stats;

})(window, document);