# Logway - Front-end remote metrics and logging

Send metrics and logs from the client (browser)
to the server (Graphite / Logstash).

Can be used for:
* Storing browser logs/erros on the server
* Getting performance.timing information (HTML5 API)
* Count A/B test scenarios
* Simple feature vote

## Client

### Install
  add to the page you want to get metrics or send logs:

```js
  <script src="/logway.min.js"
    data-logway-debug="true"
    data-logway-prefix="productname.client"
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

<!--
## Server

## Install

## Usage
-->