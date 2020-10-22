const express = require('express')
const router = express.Router()

const User = require('../models/user')
const Message = require('../models/messages')
const customErrors = require('../../lib/custom_errors')

const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')

router.post('/messagefrom', (req, res, next) => {
  const messageData = req.body
  User.findById(messageData.receiverId)
    .then(user => {
      user.messages.push(messageData)
      return user.save()
    })
    .then(user => res.status(201).json(user))
    .catch(next)
})

router.post('/messageto', (req, res, next) => {
  const messageData = req.body
  User.findById(messageData.senderId)
    .then(user => {
      user.messages.push(messageData)
      return user.save()
    })
    .then(user => res.status(201).json(user))
    .catch(next)
})

router.delete('/messages/:id', (req, res, next) => {
  const id = req.params.id
  const profileId = req.body.profileId
  Profile.findById(profileId)
    .then(handle404)
    .then(profile => {
      const message = profile.messages.id(id)
      message.remove()
      return profile.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
