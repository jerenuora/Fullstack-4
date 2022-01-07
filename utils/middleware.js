const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
  next()
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }

  next(error)
}
const getTokenFrom = (req, res, next)  => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  }
  next()
}

// const userExtractor = (req, res, next) => {
//   const decodedToken = jwt.verify(req.token, process.env.SECRET)
//   if (req.token || decodedToken.id) {
//     req.user = decodedToken.id.toString()
//   } else {
//     return res.status(401).json({ error: 'token missing or invalid' })
//   }
// }

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  getTokenFrom}
