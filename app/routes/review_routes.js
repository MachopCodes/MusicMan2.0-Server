// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for profiles
const Profile = require('../models/profile')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { profile: { title: '', text: 'foo' } } -> { profile: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()
// Create function POST a review with cURL scrip params
router.post('/reviews', (req, res, next) => {
  // get the review data from the body of the request
  // get the profile id from the review reviewData
  // find the profile by it's ID
  const reviewData = req.body.review
  const profileId = reviewData.profileId
  Profile.findById(profileId)
    .then((profile) => {
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
