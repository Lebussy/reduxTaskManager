import logger from './logger.js'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const errorHandler = (error, req, res, next) => {
  logger.error('ERROR NAME:', error.name)
  logger.error('ERROR MESSAGE:', error.message)

  switch (error.name) {
    case 'CastError':
      return res.status(400).send({ error: 'malformatted id' })
    case 'ValidationError':
      return res.status(400).send({error: error.message})
    case 'MongoServerError':
      if (error.message.includes('E11000')){
        console.log('first')
        return res.status(400).send({error: 'username already taken'})
      }
      console.log('second')
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

// Method for extracting and returning the token from and express request
const getTokenFrom = request => {
  // Get method on an express request returns the header field value passed to it
  const authorisation = request.get('Authorization')
  // If the token is using the bearer scheme, the token is extracted and returned
  if (authorisation && authorisation.startsWith('Bearer')){
    return authorisation.replace('Bearer ', '')
  }
  return null
}

// Middlewear which appends the user to the request using the token in the authorization header
// Returns status 401 if the token is invalid or user not found
const userExtractor = async (req, res, next) => {

  const token = getTokenFrom(req)

  // If no token inlcuded, return bad request status and error
  if (!token){
    return res.status(400).json({error: "no authorisation token. Please use bearer scheme"})
  }

  // Attempts to decode the token
  // Returns unauthorised status and error messgae if the token is invalid
  // If invalid, jwt.verify throws an error that needs handling if token is invalid

  let decodedData
  try {
    decodedData = jwt.verify(token, process.env.SECRET)
  } catch (e) {
    return res.status(401).json({error: e.message})
  }
  
  // If the object returned by the verify method has an 'id' property the token is valid
  if (!decodedData.id){
    return res.status(401).json({error: "invalid token"})
  }
  
  // If the user id is not found the error message is sent
  const user = await User.findById(decodedData.id)
  if (!user){
    return res.status(401).json({error: "user not found, please re-login"})
  }

  // If valid token and user found, user added to the req
  req.user = user
  next()
}

export default { errorHandler, unknownEndpoint, passwordValidator, requestLogger, userExtractor }