const express = require('express')
const passport = require('passport')
// pull in Mongoose model for profiles
const Review = require('../models/review')
const Profile = require('../models/profile')
// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()


router.post('/reviews', (req, res, next) => {
  // get the review data from the body of the request
  // get the profile id from the review reviewData
  // find the profile by it's ID
  const reviewData = req.body
  const profileId = reviewData.profileId
  Profile.findById(profileId)

    .then(profile => {
      // add subdoc to parent document
      profile.reviews.push(reviewData)
      // save parent document
      return profile.save()
    })
    .then(profile => res.status(201).json({
      profile: profile
    }))
    // send response back to slient
    // .then(profile =>)
    .catch(next)
})

router.delete('/reviews/:id', (req, res, next) => {
  const id = req.params.id
  const reviewData = req.body.review
  const profileId = reviewData.profileId
  Profile.findById(profileId)
    .then(handle404)
    .then(profile => {
      profile.reviews.id(id).remove()
      return profile.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.patch('/reviews/:id', (req, res, next) => {
  const id = req.params.id
  const reviewData = req.body.review
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

//We are destroying a REVIEW
// we need to find the profile ID
// run the profile.remove() fucntion off that

module.exports = router
