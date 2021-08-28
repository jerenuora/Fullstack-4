const app = require('./app')

const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => logger.error(error))

app.use(cors())
app.use(express.json())


const PORT = config.PORT
app.listen(PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
