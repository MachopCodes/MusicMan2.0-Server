const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  profileId: {
    type: String,
    required: true
  },
  reviewerName: {
    type: String,
    required: true
  },
  reviewerId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = reviewSchema
