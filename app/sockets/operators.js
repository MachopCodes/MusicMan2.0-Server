const opers = [];

const addOper = ({ id, name, room }) => {
  console.log('inside add operator: id, name, room', id, name, room)
  name = name.trim().toLowerCase()
  room = room.trim().toLowerCase()
  console.log('trimmed name: ', name)
  console.log('trimmed room: ', name)

  let oper = opers.find((oper) => oper.room === room && oper.name === name);
  if(oper === []) {
    return { oper }
  } else {
    oper = { id, name, room }
    console.log('oper created')
    opers.push(oper)
    return { oper }
  }
}

const removeOper = (id) => {
  const index = opers.findIndex((oper) => oper.id === id)
  if(index !== -1) return opers.splice(index, 1)[0]
}

const getOper = (id) => opers.find((oper) => oper.id === id)

const getOpersInRoom = (room) => opers.filter((oper) => oper.room === room)

module.exports = { addOper, removeOper, getOper, getOpersInRoom }
