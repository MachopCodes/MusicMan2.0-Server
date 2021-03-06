const express = require('express')
const router = express.Router()

const User = require('../models/user')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')

// CREATE MESSAGE ON USER ACCOUNT
router.post('/message', (req, res, next) => {
  const { name, room, recipient, message } = req.body
  let r = false

  const pushMessage = (user, person) => {
    r = true; user.messages.push({ room, recipient: person, message })
  }
  const pushText = (user, person) => {
    user.messages.map(m => {
      if (m.recipient === person) {
          r = true
          m.message.push(message)
        }
      }); if (!r) pushMessage(user, person)
    }

  User.findOne({ name: recipient }).then(user => {
    user.messages.length === 0
      ? pushMessage(user, name)
      : pushText(user, name)
    r = false
    user.save()
  }).then(() => User.findOne({ name })).then(user => {
    user.messages.length === 0
      ? pushMessage(user, recipient)
      : pushText(user, recipient)
    return user.save()
  }).then(user => res.status(201).json(user)).catch(next)
})

// DELETE MESSAGE FROM USER ACCOUNT
router.delete('/message/:id', (req, res, next) => {
  User.findById(req.params.id).then(handle404).then(user => {
    const message = user.messages.id(req.body.messageId)
    message.remove()
    return user.save()
  }).then(() => res.sendStatus(204)).catch(next)
})

// GETUSER
router.get('/message/:id', (req, res, next) => {
  User.findById(req.params.id).then(handle404).then(user => {
    res.status(200).json({ user: user.toObject() })
  }).catch(next)
})

module.exports = router
