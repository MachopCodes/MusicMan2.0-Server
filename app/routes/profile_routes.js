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
router.get('/profiles', (req, res, next) => {
  const { interest, instrument, state } = JSON.parse(req.query.profile)
  let q
  if (interest, instrument, state) q = { state, interest, instrument }
  if (!state && interest, instrument) q = { interest, instrument }
  if (!interest && instrument, state) q = { instrument, state }
  if (!instrument && interest, state) q = { interest, state }
  if (instrument && !state && !interest) q = { instrument }
  if (interest && !instrument && !state) q = { interest }
  if (state && !interest && !instrument) q = { state }
  if (!interest && !instrument && !state) q = null
  search = Profile.find(q).sort({ _id: -1 }).populate('owner', 'name messages')
  search.then(profiles => {
  return profiles.map(profile => profile.toObject())
}).then(profiles => res.status(200).json({ profiles })).catch(next)
})

// SHOW
router.get('/profiles/:id', (req, res, next) => {
  Profile.findById(req.params.id).then(handle404).then(profile => {
      res.status(200).json({ profile: profile.toObject() })
    }).catch(next)
})

router.get('/settings/:id', (req, res, next) => {
  Profile.find({ owner: req.params.id }).populate('owner', 'name messages')
  .then(handle404).then(profile => res.status(200).json({ profile })).catch(next)
})

// CREATE
router.post('/profiles', requireToken, (req, res, next) => {
  req.body.owner = req.user._id; Profile.create(req.body).then(profile => {
    res.status(201).json({ profile: profile.toObject() })
  }).catch(next)
})

// UPDATE
router.patch('/profiles/:id', requireToken, removeBlanks, (req, res, next) => {
  Profile.findByIdAndUpdate({
     _id: req.params.id
   },{
     name: req.body.name, contact: req.body.contact, location: req.body.location,
     instruments: req.body.instruments, interests: req.body.interests, blurb: req.body.blurb
   }).then(handle404).then(profile => {
     return profile.save()
   }).then(() => res.sendStatus(204)).catch(next)
})

// DESTROY
router.delete('/profiles/:id', requireToken, (req, res, next) => {
  Profile.findById(req.params.id).then(handle404).then(profile => {
      requireOwnership(req, profile); profile.deleteOne()
    }).then(() => res.sendStatus(204)).catch(next)
})

module.exports = router
