let net = require('net')
let config = require('../src/config')

class ServerMock {

  constructor () {
    this.startGraphiteMockServer()
    this.startLogstashMockServer()
  }

  startLogstashMockServer () {
    let server = net.createServer(socket => {
      socket.on('data', data => {
        console.log('[logstash-mock] Received data:', data.toString())
      })

      socket.on('close', () => {
        console.log('[logstash-mock] Connection closed')
      })

      socket.on('error', error => {
        console.log('[logstash-mock]', error)
      })
    })

    server.listen({port: config.logstash.port}, () => {
      console.log('[logstash-mock] Server running on port',
      config.logstash.port,
      server.address())
    })
  }

  startGraphiteMockServer () {
    let server = net.createServer(socket => {
      socket.on('data', data => {
        console.log('[graphite-mock] Received data:', data.toString())
      })

      socket.on('close', () => {
        console.log('[graphite-mock] Connection closed')
      })

      socket.on('error', error => {
        console.log('[graphite-mock]', error)
      })
    })

    server.listen({port: config.graphite.port}, () => {
      console.log('[graphite-mock] Server running on port',
        config.graphite.port,
        server.address())
    })
  }

}

new ServerMock()
