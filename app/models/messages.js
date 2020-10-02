const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  to: {
    type: String,
    required: true
  },
  from: {
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
