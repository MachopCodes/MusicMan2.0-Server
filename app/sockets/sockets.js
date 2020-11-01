const { addOper, removeOper, getOper, getOpersInRoom } = require('./operators')
const socketIo = require('socket.io')

exports.joinRoom = (socket, io) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, oper } = addOper({ id: socket.id, name, room })
    console.log('USER CONNECTED!', name, oper)
    if(error) return callback(error)
    socket.join(oper.room)
    io.to(oper.room).emit('roomData', {room: oper.room, opers: getOpersInRoom(oper.room) })
    callback()
  })
}

exports.sendMessage = (socket, io) => {
  socket.on('sendMessage', (message, callback) => {
    const oper = getOper(socket.id)
    console.log('INCOMING MESSAGE!', name, oper)
    io.to(oper.room).emit('message', { oper: oper.name, text: message })
    callback()
  })
}

exports.disconnect = (socket, io) => {
  socket.on('disconnect', () => {
    const oper = removeOper(socket.id)
    console.log('USER DISCONNECTED', oper)
    if (oper) {
      io.to(oper.room).emit('roomData', { room: oper.room, opers: getOpersInRoom(oper.room) })
    }
  })
}
