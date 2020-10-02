const express = require('express')
const router = express.Router()

const User = require('../models/user')
const Message = require('../models/messages')
const customErrors = require('../../lib/custom_errors')

const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')

router.post('/messagefrom', (req, res, next) => {
  const messageData = req.body
  User.findById(messageData.from)
    .then(user => {
      user.messages.push(messageData)
      return user.save()
    })
    .then(user => res.status(201).json(user))
    .catch(next)
})

router.post('/messageto', (req, res, next) => {
  const messageData = req.body
  User.findById(messageData.from)
    .then(user => {
      user.messages.push(messageData)
      return user.save()
    })
    .then(user => res.status(201).json(user))
    .catch(next)
})

module.exports = router
