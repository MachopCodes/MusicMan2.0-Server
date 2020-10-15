const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  receiverId: {
    type: String,
    required: true
  },
  receiverName: {
    type: String,
    required: true
  },
  text: {
    type: String
  }
}, {
    timestamps: true
})

module.exports = messageSchema
