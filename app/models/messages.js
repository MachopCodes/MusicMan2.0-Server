const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  to: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: Number,
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

module.exports = messageSchema
