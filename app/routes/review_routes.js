const express = require('express')
const passport = require('passport')

const Review = require('../models/review')
const Profile = require('../models/profile')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

router.post('/reviews', (req, res, next) => {
  const reviewData = req.body
  console.log('review data is: ', reviewData)
  const profileId = reviewData.profileId
  Profile.findById(profileId)
    .then(profile => {
      profile.reviews.push(reviewData)
      return profile.save()
    })
    .then(profile => {
      res.status(201).json(profile)
    })
    .catch(next)
})

router.delete('/reviews/:id', (req, res, next) => {
  const id = req.params.id
  const profileId = req.body.profileId
  Profile.findById(profileId)
    .then(handle404)
    .then(profile => {
      const review = profile.reviews.id(id)
      review.remove()
      return profile.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.patch('/reviews/:id', (req, res, next) => {
  const id = req.params.id
  const reviewData = req.body
  const profileId = reviewData.profileId
  Profile.findById(profileId)
    .then(handle404)
    .then(profile => {
      profile.reviews.id(id).set(reviewData)
      return profile.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
