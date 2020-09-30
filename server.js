const cors = require('cors')
const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const socketIo = require('socket.io')

const userRoutes = require('./app/routes/user_routes')
const profileRoutes = require('./app/routes/profile_routes')
const reviewRoutes = require('./app/routes/review_routes')
const messageRoutes = require('./app/routes/message_routes')

const errorHandler = require('./lib/error_handler')
const replaceToken = require('./lib/replace_token')
const requestLogger = require('./lib/request_logger')

const db = require('./config/db')
const auth = require('./lib/auth')

const serverDevPort = 4741
const clientDevPort = 7165


mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}` }))
app.use(replaceToken)
app.use(auth)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(requestLogger)

app.use(userRoutes)
app.use(profileRoutes)
app.use(reviewRoutes)
app.use(messageRoutes)

app.use(errorHandler)

const port = process.env.PORT || serverDevPort
const server = http.createServer(app)
const io = socketIo(server)
const { addOper, removeOper, getOper, getOpersInRoom } = require('./app/operators')

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, oper } = addOper({ id: socket.id, name, room })
    console.log('user joined!!', name)
    if(error) return callback(error)

    socket.join(oper.room)

    socket.emit('message', {
      oper: 'admin',
      text: `${oper.name}, welcome to the chat ${oper.room}`
    })
    socket.broadcast.to(oper.room).emit('message', {
      oper: 'admin',
      text: `${oper.name}, has joined`
    })

    io.to(oper.room).emit('roomData', {room: oper.room, opers: getOpersInRoom(oper.room) })

    callback()
  })

  socket.on('sendMessage', (message, callback) => {
    const oper = getOper(socket.id)
    console.log('oper is: ', oper)

    io.to(oper.room).emit('message', {
      oper: oper.name,
      text: message
    })
    console.log('message sent was :', message)

    callback()
  })

  socket.on('disconnect', () => {
    const oper = removeOper(socket.id)

    if (oper) {
      io.to(oper.room).emit('message', {
        oper: 'Admin',
        text: `${oper.name} has left.`
      })
      io.to(oper.room).emit('roomData', {
        room: oper.room,
        opers: getOpersInRoom(oper.room)
      })
    }
  })
})

server.listen(port, () => console.log('server listening on port ' + port))

module.exports = app
