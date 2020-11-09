const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  recipient: String,
  room: String,
  message: [{ sender: String, text:String }]
}, {
  timestamps: true
})

module.exports = messageSchema
