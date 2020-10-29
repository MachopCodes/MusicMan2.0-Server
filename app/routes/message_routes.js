const express = require('express')
const router = express.Router()

const User = require('../models/user')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')

// CREATE MESSAGE ON USER ACCOUNT
router.post('/messagefrom', (req, res, next) => {
  const messageData = req.body; User.findById(messageData.senderId).then(user => {
    console.log('that message was sent from: ', user.name)
    user.messages.push(messageData); return user.save()
    }).then(user => res.status(201).json(user)).catch(next)
})

// CREATE MESSAGE ON RECEIVER ACCOUNT
router.post('/messageto', (req, res, next) => {
  const messageData = req.body; User.findById(messageData.receiverId).then(user => {
    console.log('that message was sent to: ', user.name)
    user.messages.push(messageData); return user.save()
    }).then(user => res.status(201).json(user)).catch(next)
})

// DELETE MESSAGE FROM USER ACCOUNT
router.delete('/messages/:id', (req, res, next) => {
  const id = req.body.profileId
  User.findById(req.params.id).then(handle404).then(user => {
      for (let i = 0; i < user.messages.length; i++) {
        if (user.messages[i].senderId === id || user.messages[i].receiverId === id) {
          user.messages.splice(user.messages[i], 1); i--
          }
        }; return user.save()
      }).then(() => res.sendStatus(204)).catch(next)
})

// GETUSER
router.get('/get-user/:id', (req, res, next) => {
  User.findById(req.params.id).then(handle404).then(user => {
    res.status(200).json({ user: user.toObject() })
  }).catch(next)
})

module.exports = router
