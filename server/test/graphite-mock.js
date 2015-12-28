let net = require('net')

class GraphiteMock {
  constructor() {
    return this.start()
  }

  start() {
    let server = net.createServer(socket => {
      socket.on('data', data => {
        console.log('Received data', data.toString())
      })

      socket.on('close', () => {
        console.log('Connection closed');
      })

      socket.on('error', (error) => {
        console.log(error);
      })

    });

    server.listen({port: 231}, () => {
      let address = server.address();
      console.log('opened server on %j', address);
    });

    return server
  }

}

new GraphiteMock()