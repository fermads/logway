let net = require('net')

class ServerMock {

  constructor() {
    this.startGraphiteMockServer()
    this.startLogstashMockServer()
  }

  startLogstashMockServer() {
    let server = net.createServer(socket => {
      socket.on('data', data => {
        console.log('Received data:', data.toString())
      })

      socket.on('close', () => {
        console.log('Connection closed')
      })

      socket.on('error', error => {
        console.log(error)
      })
    })

    server.listen({port: 9000}, () => {
      console.log('Logstash mock server running...', server.address())
    })
  }

  startGraphiteMockServer() {
    let server = net.createServer(socket => {
      socket.on('data', data => {
        console.log('Received data:', data.toString())
      })

      socket.on('close', () => {
        console.log('Connection closed')
      })

      socket.on('error', error => {
        console.log(error)
      })
    })

    server.listen({port: 231}, () => {
      console.log('Graphite mock server running...', server.address())
    })
  }

}

new ServerMock()