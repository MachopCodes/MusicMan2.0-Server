const { addOper, removeOper, getOper, getOpersInRoom } = require('./operators')
const socketIo = require('socket.io')

exports.joinRoom = (socket, io) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, oper } = addOper({ id: socket.id, name, room })
    if(error) return callback(error)
    socket.join(oper.room)
    io.to(oper.room).emit('roomData', {room: oper.room, opers: getOpersInRoom(oper.room) })
    callback()
  })
}

exports.sendMessage = (socket, io) => {
  socket.on('sendMessage', (message, callback) => {
    const oper = getOper(socket.id)
    io.in(oper.room).emit('message', { oper: oper.name, text: message })
    callback()
  })
}

exports.disconnect = (socket, io) => {
  socket.on('disconnect', () => {
    const oper = removeOper(socket.id)
    console.log('user disconnected', oper)
    if (oper) {
      io.to(oper.room).emit('roomData', { room: oper.room, opers: getOpersInRoom(oper.room) })
    }
  })
}
