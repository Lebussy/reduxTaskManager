import logger from './logger.js'

const errorHandler = (error, req, res, next) => {
  logger.error('ERROR NAME:', error.name)

  switch (error.name) {
    case 'CastError':
      return res.status(400).send({ error: 'malformatted id' })
    case 'ValidationError':
      return res.status(400).send({error: error.message})
  }

  next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpiont'})
}

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

export default { errorHandler, unknownEndpoint, requestLogger }