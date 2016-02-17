let net = require('net')

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

    server.listen({port: 9000}, () => {
      console.log('[logstash-mock] Server running on port 9000',
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

    server.listen({port: 231}, () => {
      console.log('[graphite-mock] Server running on port 231',
        server.address())
    })
  }

}

new ServerMock()
