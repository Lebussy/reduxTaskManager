import express from 'express'
import cors from 'cors'
import tasksRouter from './controllers/tasks.js'
import usersRouter from './controllers/users.js'
import middlewear from './utils/middlewear.js'
import 'express-async-errors'
import mongoose from 'mongoose'
import config from './utils/config.js'
import logger from './utils/logger.js'
import loginRouter from './controllers/login.js'

const app = express()

mongoose.set('strictQuery', false)

console.log('connnecting to ', config.MONGODB_URI)

try {
  await mongoose.connect(config.MONGODB_URI)
  logger.info('connected to mongoDB')
} catch (error) {
  logger.error('error connecting to mongoDB', error.message)
}

// Allows for Cross-Origin-Resource-Sharing
app.use(cors())

// Middlewear that parses incoming json payloads from the reqests, and makes available in req.body
app.use(express.json())
app.use(middlewear.requestLogger)

// Middlewear for express application that serves a static file if a request is made to a resource matching a 
// resource within 'dist'
app.use(express.static('dist'))

// The route handler for the api/tasks route
app.use('/api/tasks', tasksRouter)

// Route handler for the users route
app.use('/api/users', usersRouter)

// Route handler for the login route
app.use('/api/login', loginRouter)

app.use(middlewear.unknownEndpoint)

app.use(middlewear.errorHandler)

export default app
