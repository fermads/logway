# Logway - Front-end Remote Metrics and Logging

Send metrics and logs from the client (browser)
to the server (Graphite / Logstash).

Can be used for:
* Store browser logs/erros on the server
* Getting performance.timing information (HTML5 API)
* A/B testing
* Simple feature vote

## Client

### Install
  add to the page you want to get metrics or send logs:

```js
  <script src="/logway.js"
    data-logway-debug="true"
    data-logway-prefix="scoreboard.client"
    data-logway-host="http://localhost/v1"></script>
```

#### Options
* data-logway-debug (Boolean): Turn on/off console messages
* data-logway-prefix (String): Prefix to prepend to every metric
* data-logway-host (String): Host to send metrics/logs

### Client API - Core

#### Logway.count
Send a counter to the server
```js
  Logway.count('test.countreset', 4);
```

#### Logway.stats
Send a value to the server. This value will be grouped with other values for the
same metric and statistics will be generated (percentiles, average/mean,
standard deviation, sum, lower and upper bounds)
```js
  Logway.stats('test.stats', 10);
```

#### Logway.write
Write logs to the server
```js
  Logway.write('Testing 1 2 3');
```


## Server

## Install

## Usage

