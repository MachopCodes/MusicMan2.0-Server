const express = require('express')
const passport = require('passport')
const Profile = require('../models/profile')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// INDEX
// GET /profiles
router.get('/profiles', (req, res, next) => {
  Profile.find()
    .then(profiles => {
      // .populate('reviews.reviewer')
      // .populate('owner')
      // `profiles` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return profiles.map(profile => profile.toObject())
    })
    // respond with status 200 and JSON of the profiles
    .then(profiles => res.status(200).json({ profiles: profiles }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /profiles/5a7db6c74d55bc51bdf39793
router.get('/profiles/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Profile.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "profile" JSON
    .then(profile => res.status(200).json({ profile: profile.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST
router.post('/profiles', requireToken, (req, res, next) => {
  req.body.owner = req.user._id
  Profile.create(req.body)
    .then(profile => res.status(201).json({ profile: profile.toObject() }))
    .catch(next)
})

// UPDATE
// PATCH /profiles/5a7db6c74d55bc51bdf39793
router.patch('/profiles/:id', requireToken, removeBlanks, (req, res, next) => {
  console.log(req.params)
  Profile.findByIdAndUpdate({
     _id: req.params.id
   },{
      name: req.body.name,
      contact: req.body.contact,
      location: req.body.location,
      instruments: req.body.instruments,
      interests: req.body.interests,
      blurb: req.body.blurb
    })
    .then(handle404)
    .then(profile => {
      return profile.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /profiles/5a7db6c74d55bc51bdf39793
router.delete('/profiles/:id', requireToken, (req, res, next) => {
  Profile.findById(req.params.id)
    .then(handle404)
    .then(profile => {
      // throw an error if current user doesn't own `profile`
      requireOwnership(req, profile)
      // delete the profile ONLY IF the above didn't throw
      profile.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
