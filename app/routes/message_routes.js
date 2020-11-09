const express = require('express')
const router = express.Router()

const User = require('../models/user')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')

// CREATE MESSAGE ON USER ACCOUNT
router.post('/message', (req, res, next) => {
  const { name, room, recipient, text } = req.body
  const pushConversation = (user, recipient, name, text) => user.messages.push({
      recipient: person, room, message: { sender: name, text }
    })

  const push = (user, person, text) => {
    let record = false
    user.messages.length === 0 ? pushConversation(user, name)
      : user.messages.map(m => {
        if (name === m.recipient) {
          record = true
          user.messages.message.push({
            sender: person, text
          })
        }
      })
      if (!record) pushConversation(user, name)
      return user.save()
    }

  User.findOne({ name })
    .then(user => push(user, recipient, text))
    .then(() => User.findOne({ name: recipient }))
      .then(user => push(user, name))
    .then(user => res.status(201).json(user))
    .catch(next)
  })

// DELETE MESSAGE FROM USER ACCOUNT
router.delete('/messages/:id', (req, res, next) => {
  const id = req.body.profileId
  User.findById(req.params.id).then(handle404).then(user => {
      for (let i = 0; i < user.messages.length; i++) {
        if (user.messages[i].sender === id || user.messages[i].receiver === id) {
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
