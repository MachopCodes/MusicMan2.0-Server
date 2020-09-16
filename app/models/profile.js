const mongoose = require('mongoose')
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching')
const reviewSchema = require('./review')

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  instrument: {
    type: String,
    required: true
  },
  interest: {
    type: String,
    required: true
  },
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

profileSchema.plugin(mongoose_fuzzy_searching, { fields: ['location', 'interest', 'instrument'] })

module.exports = mongoose.model('Profile', profileSchema)
