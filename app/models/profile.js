const mongoose = require('mongoose')
const reviewSchema = require('./review')

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  instruments: [{
    type: String,
    required: true
  }],
  interests: [{
    type: String,
    required: true
  }],
  blurb: {
    type: String
  },
  reviews: [reviewSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Profile', profileSchema)
