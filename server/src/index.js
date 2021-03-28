import http from 'http'
import Event from 'events'
import SocketServer from './socket.js'
import { constants } from './constants.js'
import Controller from './controller.js'

const port = 9898
const eventEmitter = new Event()

const socketServer = new SocketServer({ port })
const server = await socketServer.initialize(eventEmitter)


console.log('server running on port', server.address().port)

const controller = new Controller({ socketServer })
eventEmitter.on(constants.event.NEW_USER_CONNECTED, controller.onNewConnection.bind(controller))


function testServer() {
  const options = {
    port: 9898,
    host: 'localhost',
    headers: {
      Connection: 'Upgrade',
      Upgrade: 'websocket'
    }
  }

  // Simula a chamda do cliente
  const req = http.request(options)
  req.end()

  // ou once em caso de ser retornado por uma promise
  req.on('upgrade', (res, socket, buffer) => {
    socket.on('data', data => {
      console.log('client received', data.toString())
    })

    setInterval(() => {
      socket.write('Hello!')
    }, 1000)

  })
}

testServer();