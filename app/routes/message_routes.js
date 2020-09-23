const express = require('express')
const passport = require('passport')
const Message = require('../models/messages')
const User = require('../models/user')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

router.post('/messages', (req, res, next) => {
  const messageData = req.body
  console.log('message data is: ', messageData)
  const userId = messageData.to
  User.findById(userId)
    .then(user => {
      user.messages.push(messageData)
      return user.save()
    })
    .then(user => {
      res.status(201).json(user)
    })
    .catch(next)
})

module.exports = router
