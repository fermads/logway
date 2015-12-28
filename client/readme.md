# Log UI Client
Client library for sending metrics and logs from the client (browser) to the
server (Graphite / Logstash).

## Install

## Example
<!--

```<script src="logui.js"
  data-logui-debug="true"
  data-logui-prefix="scoreboard.client"
  data-logui-host="127.0.0.1"></script>
<script>```

```Logui.add('bla.ble.bli', 2);
Logui.put('bla.ble.leel', 4);
Logui.stats('ble.bli.test', 8);```

## Client API

### Logui.add
Cria nova métrica se ela não existir ou adiciona (soma) o valor a métrica se
ela já existir no intervalo `flushInterval`

Exemplo: ao enviar a métrica
`teste.client.testeab.iniciou 1`
10 vezes em um intervalo menor que `flushInterval`, o valor enviado será 10
`teste.client.testeab.iniciou 10`


### Logui.put
Cria nova métrica se ela não existir ou substitui o valor da métrica caso
ela já existir no intervalo `flushInterval`

Exemplo: ao enviar a métrica
`teste.client.testeab.iniciou 1`
10 vezes em um intervalo menor que `flushInterval`, o valor enviado será 1
`teste.client.testeab.iniciou 1`


### Logui.stats
Gera estatísticas (percentiles, average/mean, standard deviation, sum, lower
and upper bounds) dos valores enviados


## To-do
* Rate limit (numero maximo de 'sends')
* Validar nomes das metricas do graphite e verificar se tem "nnn.client."

-->