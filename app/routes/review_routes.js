const express = require('express')
const passport = require('passport')
const Profile = require('../models/profile')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const router = express.Router()

//CREATE
router.post('/reviews', (req, res, next) => {
  const reviewData = req.body; const profileId = reviewData.profileId
  Profile.findById(profileId).then(profile => {
    profile.reviews.push(reviewData); return profile.save()
  }).then(profile => res.status(201).json(profile)).catch(next)
})
//UPDATE
router.patch('/reviews/:id', (req, res, next) => {
  const id = req.params.id; const reviewData = req.body
  Profile.findById(reviewData.profileId).then(handle404).then(profile => {
      profile.reviews.id(id).set(reviewData); return profile.save()
    }).then(() => res.sendStatus(204)).catch(next)
})
//DESTROY
router.delete('/reviews/:id', (req, res, next) => {
  const id = req.params.id; const profileId = req.body.profileId
  Profile.findById(profileId).then(handle404).then(profile => {
      const review = profile.reviews.id(id)
      review.remove(); return profile.save()
    }).then(() => res.sendStatus(204)).catch(next)
})

module.exports = router
