const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  content: String,
  profileId: String,
  reviewerName: String,
  reviewerId: String,
  rating: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

module.exports = reviewSchema
