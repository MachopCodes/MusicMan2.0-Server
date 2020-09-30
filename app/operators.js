const opers = [];

const addOper = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingOper = opers.find((oper) => oper.room === room && oper.name === name);

  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingOper) return { error: 'Username is taken.' };

  const oper = { id, name, room };

  opers.push(oper);

  return { oper };
}

const removeOper = (id) => {
  const index = opers.findIndex((oper) => oper.id === id);

  if(index !== -1) return opers.splice(index, 1)[0];
}

const getOper = (id) => opers.find((oper) => oper.id === id);

const getOpersInRoom = (room) => opers.filter((oper) => oper.room === room);

module.exports = { addOper, removeOper, getOper, getOpersInRoom };
