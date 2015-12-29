// colocar um rate limit no client maxsend = 100 por exemplo

;(function(w, d) {
  var tid = 0;
  var storage = {};
  var delay = opt('delay', 1000);
  var prefix = opt('prefix', '');
  var host = opt('host', 'http://ferlog.uol.com.br/metric');
  var debug = opt('debug', false);
  var globvar = opt('global', 'Fer');
  var timeout = opt('timeout', 500);

  init();

  function init() {
    log('Options are...'
      +'\n\tprefix : '+ prefix
      +'\n\thost   : '+ host
      +'\n\ttimeout: '+ timeout
      +'\n\tglobal : '+ globvar);

    if(!w[globvar])
      w[globvar] = {};

    if(prefix)
      prefix += '.';
  }

  function opt(prop, defaultValue) {
    var sel = d.querySelector('[data-ferlog-'+ prop +']');
    return sel ? sel.getAttribute('data-ferlog-'+ prop) : defaultValue;
  }

  function put(fqn, value) {
    store(fqn, value, 'p');
  }

  function add(fqn, value) {
    store(fqn, value, 'a');
  }

  function stats(fqn, value) {
    store(fqn, value, 's');
  }

  function store(fqn, value, type) {
    if(!fqn || value === undefined || value === 0)
      return;

    if(storage[fqn] && type == 'a')
      storage[fqn].value += value;
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
    var req = new XMLHttpRequest();
    req.open('POST', host);
    req.ontimeout = function () {
      log('request timed out');
    };
    req.timeout = timeout;
    req.setRequestHeader('Content-Type', 'text/plain');

    var metrics = flush();
    req.send(metrics);
    log('Sending...\n\t'+ metrics.replace(/\n[^$]/g, '\n\t'));

    tid = 0;
  }

  w[globvar].put = put;
  w[globvar].add = add;
  w[globvar].stats = stats;

})(window, document);