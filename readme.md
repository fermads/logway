# ferlog - Front End Remote Analytics and Logging

Client and server application for sending metrics and logs from the
client (browser) to the server (Graphite / Logstash).

Can be used for:
* Getting performance.timing information (HTML5 API)
* Store browser logs/erros on the server
* A/B testing
* Simple feature vote

## Client

### Install
  add to the page you want to get metrics or send logs:

```js
  <script src="/ferlog.js"
    data-ferlog-debug="true"
    data-ferlog-prefix="scoreboard.client"
    data-ferlog-host="http://localhost/v1"></script>
```

#### Options
* data-ferlog-debug (Boolean): Turn on/off console messages
* data-ferlog-prefix (String): Prefix to prepend to every metric
* data-ferlog-host (String): Host to send metrics/logs

### Client API - Core

#### Ferlog.count
Send a counter to the server
```js
  Ferlog.count('test.countreset', 4);
```

#### Ferlog.stats
Send a value to the server. This value will be grouped with other values for the
same metric and statistics will be generated (percentiles, average/mean,
standard deviation, sum, lower and upper bounds)
```js
  Ferlog.stats('test.stats', 10);
```

#### Ferlog.write
Write logs to the server
```js
  Ferlog.write('Testing 1 2 3');
```


## Server

## Install

## Usage

