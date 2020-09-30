const express = require('express')
const router = express.Router()

router.get('/socket', (req, res, next) => {
  res.send('message server up and running')
})

module.exports = router
