# ferlog - Front End Remote Analytics and Logging

feral


Client and server application for sending metrics and logs from the
client (browser) to the server (Graphite / Logstash).

Can be used for getting performance.timing information (HTML5 page
performance API), A/B testing or just to store client logs/erros on the server.

## Client

### Install

### Usage

### Client API

#### Ferlog.count
Cria nova métrica se ela não existir ou adiciona (soma) o valor a métrica se
ela já existir no intervalo `flushInterval`

Exemplo: ao enviar a métrica
`teste.client.testeab.iniciou 1`
10 vezes em um intervalo menor que `flushInterval`, o valor enviado será 10
`teste.client.testeab.iniciou 10`


#### Ferlog.stats
Gera estatísticas (percentiles, average/mean, standard deviation, sum, lower
and upper bounds) dos valores enviados

#### Ferlog.write



## Server

## Install

## Usage

## Supported backends