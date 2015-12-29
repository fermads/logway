# ferlog - Front End Remote Logging - Client
Client library for sending metrics and logs from the client (browser) to the
server (Graphite / Logstash).

## Install

## Example
<!--

```<script src="ferlog.js"
  data-ferlog-debug="true"
  data-ferlog-prefix="scoreboard.client"
  data-ferlog-host="127.0.0.1"></script>
<script>```

```Ferlog.add('bla.ble.bli', 2);
Ferlog.put('bla.ble.leel', 4);
Ferlog.stats('ble.bli.test', 8);```

## Client API

### Ferlog.add
Cria nova métrica se ela não existir ou adiciona (soma) o valor a métrica se
ela já existir no intervalo `flushInterval`

Exemplo: ao enviar a métrica
`teste.client.testeab.iniciou 1`
10 vezes em um intervalo menor que `flushInterval`, o valor enviado será 10
`teste.client.testeab.iniciou 10`


### Ferlog.put
Cria nova métrica se ela não existir ou substitui o valor da métrica caso
ela já existir no intervalo `flushInterval`

Exemplo: ao enviar a métrica
`teste.client.testeab.iniciou 1`
10 vezes em um intervalo menor que `flushInterval`, o valor enviado será 1
`teste.client.testeab.iniciou 1`


### Ferlog.stats
Gera estatísticas (percentiles, average/mean, standard deviation, sum, lower
and upper bounds) dos valores enviados


## To-do
* Rate limit (numero maximo de 'sends')
* Validar nomes das metricas do graphite e verificar se tem "nnn.client."

-->