import logger from './logger.js'

const errorHandler = (error, req, res, next) => {
  logger.error('ERROR NAME:', error.name)
  logger.error('ERROR MESSAGE:', error.message)

  switch (error.name) {
    case 'CastError':
      return res.status(400).send({ error: 'malformatted id' })
    case 'ValidationError':
      return res.status(400).send({error: error.message})
    case 'MongoServerError':
      return res.status(400).send({error: error.message})
  }

  next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpiont'})
}

// Middlewear for validating the strength of a password
const passwordValidator = (req, res, next) => {
  if (req.method === 'POST'){
    if (req.body.password.length < 5){
      return res.status(400).json({error: 'password too weak'})
    }
  }
  next()
}
 
const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

export default { errorHandler, unknownEndpoint, passwordValidator, requestLogger }