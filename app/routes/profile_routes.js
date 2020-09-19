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
  let search
  if(!req.query.profile) {
    search = Profile.find().populate('owner')
  } else {
    p = JSON.parse(req.query.profile)
    let q
    if (!p.interest && p.instrument && p.state) {
      q = { instrument: p.instrument, state: p.state }
    } else if (p.interest && !p.instrument && p.state) {
      q = { interest: p.interest, state: p.state }
    } else if (p.interest && p.instrument && !p.state) {
      q = { interest: p.interest, instrument: p.instrument }
    } else if (!p.interest && !p.instrument && p.state) {
      q = { state: p.state }
    } else if (p.interest && !p.instrument && !p.state) {
      q = { interest: p.interest }
    } else if (!p.interest && p.instrument && !p.state) {
      q = { instrument: p.instrument }
    } else {
      q = {
        state: p.state,
        interest: p.interest,
        instrument: p.instrument
      }
    }
    if(p.city) {
      search = Profile.find(q).populate('owner')
      // search = Profile.find(q).fuzzySearch(p.city).populate('owner')
    } else {
      search = Profile.find(q).populate('owner')
    }
  }
  search.then(profiles => {
    return profiles.map(profile => profile.toObject())
  })
    .then(profiles => res.status(200).json({ profiles: profiles }))
    .catch(next)
  })


// SHOW
// GET /profiles/5a7db6c74d55bc51bdf39793
router.get('/profiles/:id', (req, res, next) => {
  Profile.findById(req.params.id)
    .then(handle404)
    .then(profile => res.status(200).json({ profile: profile.toObject() }))
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
      requireOwnership(req, profile)
      profile.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})



module.exports = router
