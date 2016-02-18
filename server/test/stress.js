var http = require('http')

var reqerror, reserror, generror, reqto, resto, not200, gzip,
  retry, date, conns, reqs, errormsgs

var data = 'p scoreboard.client.\n'
  +'c test.count 6\n'
  +'c test.countreset 6\n'
  +'s test.stats 20\n'
  +'l INFO teste legal lalala\n'
  +'l DEBUG outro teste de log'

var options = {
  connections : 1000,
  padding : 6,
  host : '127.0.0.1',
  port : 80,
  path : '/v1',
  method : 'POST',
  agent : false,
  reconnectDelay : 1000,
  reportDelay : 1000,
  requestTimeout : 5000,
  responseTimeout : 5000
}

function init() {
  reset(true)
  argumentz()

  for (var x = 0; x < options.connections; x++) {
    connect()
  }

  setInterval(report, options.reportDelay)

  commands()

  process.on('uncaughtException', function(err) {
    errormsgs[err.message] = true
    generror++
  });
}

function commands() {
  process.stdin.resume();
  process.stdin.setRawMode(true);
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function(c) {
    var key = c.toString();
    if(c === '\03' || key == 'q') {
      process.exit()
    }
    else if (key == 'm' || key == 'd'){
      mark()
    }
    else if (key == 'r' || key == 'c'){
      console.log('\033[1;33m#RESET\u001b[0m');
      reset();
    }
  })
}

function mark() {
  date = new Date()
  console.log('\033[1;33m#'+ date.toGMTString() +'\u001b[0m');
}

function reset(initial) {
  reqerror = 0
  reserror = 0
  generror = 0
  reqto = 0
  resto = 0
  not200 = 0
  gzip = 0
  retry = 0
  if (initial) {
    date = new Date()
    conns = 0
  }
  reqs = 0
  errormsgs = {}
}

function argumentz() {
  var arg = process.argv[2], params = '';
  if(!arg) {
    for(var j in options) {
      params += j +',';
    }

    console.log('Usage  : troll [jsonOptions]');
    console.log('Example: troll {connections:1500,port:80,path:/sub?id=test,host:10.64.3.0}');
    console.log('Options: '+ params.replace(/,$/,''));
    console.log('Default: '+ JSON.stringify(options).replace(/"/g, '') + '\n\n');
    return;
  }

  var args = arg.replace('{','{"').replace('}','"}').replace(/:/g,'":"').replace(/,/g,'","');
  var json = JSON.parse(args);

  for (var i in json) {
    options[i] = json[i];
  }

  params = '';
  for(var k in options) {
    params += '\n\t'+ k +': ' + options[k];
  }

  console.log('Using: '+ params );
}

function connect() {
  var req = http.request(options);
  req.end(data)

  conns++;
  reqs++;

  req.on('response', function(res) {
    response(req, res)
  })

  req.setTimeout(options.requestTimeout, function() {
    reqto++;
  })

  req.on('error', function(err) {
    reqerror++;
    conns--;
    errormsgs[err.message] = true;
    reconnect();
  })
}

 function response(req, res) {
  var chunks = [];

  if(res.statusCode != 200) {
    not200++;
    errormsgs['statusCode'+ res.statusCode] = true;
  }

  res.on('data', function(chunk) {
    chunks.push(chunk);
  })

  res.connection.setMaxListeners(0);
  res.connection.setTimeout(options.responseTimeout, function() {
    resto++;
  })

  res.on('error', function(err) {
    errormsgs[err.message] = true;
    reserror++;
  })

  res.on('end', function () {
    var content = Buffer.concat(chunks);

    if(res.headers['content-encoding'] == 'gzip') {
      gzip++
    }
    else if (content.toString().indexOf('retry') != -1) {
      retry++;
    }


    conns--;
    reconnect();
  });
}

 function reconnect() {
  setTimeout(connect, options.reconnectDelay);
}

function report() {

  var pad = function(n) {
    var len = n.toString().length, r = n.toString();
    for(var i = 0; i < (options.padding - len); i++) {
      r = r + ' ';
    }
    return r;
  }

  var color = function(text) {
    return ' \033[0;34m'+ text +':\u001b[0m'
  }

  var msg = color('reqs') + pad(reqs) +
    color('conns') + pad(conns) +
    color('generr') + pad(generror) +
    color('reserr') + pad(reserror) +
    color('reqerr') + pad(reqerror) +
    color('reqto') + pad(reqto) +
    color('resto') + pad(resto) +
    color('gzip') + pad(gzip) +
    color('retry') + pad(retry) +
    color('not200') + pad(not200);

  for(var i in errormsgs) {
    console.log('\033[1;31m#ERROR:\u001b[0m '+ i);
    delete errormsgs[i];
  }

  if(date.getMinutes() != new Date().getMinutes()) {
    mark()
  }

  console.log(msg);
}

init();


