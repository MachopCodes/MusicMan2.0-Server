const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: [{
    type: String
  }],
  to: {
    type: String,
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
