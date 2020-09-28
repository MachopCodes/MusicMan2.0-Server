const express = require('express')
const router = express.Router()
// const passport = require('passport')
// const User = require('../models/user')
// const customErrors = require('../../lib/custom_errors')
// const handle404 = customErrors.handle404
// const requireOwnership = customErrors.requireOwnership
// const removeBlanks = require('../../lib/remove_blank_fields')
// const requireToken = passport.authenticate('bearer', { session: false })

router.get('/', (req, res, next) => {
  res.send({ response: "I'm alive" }).status(200)
})

module.exports = router
