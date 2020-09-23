const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const userRoutes = require('./app/routes/user_routes')
const profileRoutes = require('./app/routes/profile_routes')
const reviewRoutes = require('./app/routes/review_routes')
const messageRoutes = require('./app/routes/message_routes')

const errorHandler = require('./lib/error_handler')
const replaceToken = require('./lib/replace_token')
const requestLogger = require('./lib/request_logger')

const db = require('./config/db')
const auth = require('./lib/auth')
const serverDevPort = 4741
const clientDevPort = 7165

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}` }))

const port = process.env.PORT || serverDevPort

app.use(replaceToken)
app.use(auth)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(requestLogger)

app.use(userRoutes)
app.use(profileRoutes)
app.use(reviewRoutes)
app.use(messageRoutes)

app.use(errorHandler)

app.listen(port, () => { console.log('listening on port ' + port) })

module.exports = app
