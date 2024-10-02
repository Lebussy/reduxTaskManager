import express from 'express'
import cors from 'cors'
import tasksRouter from './controllers/tasks.js'
import middlewear from './utils/middlewear.js'
import 'express-async-errors'
import mongoose from 'mongoose'
import config from './utils/config.js'
import logger from './utils/logger.js'

const app = express()

mongoose.set('strictQuery', false)

console.log('connnecting to ', config.MONGODB_URI)

try {
  await mongoose.connect(config.MONGODB_URI)
  logger.info('connected to mongoDB')
} catch (error) {
  logger.error('error connecting to mongoDB', error.message)
}

app.use(cors())
app.use(express.json())
app.use(middlewear.requestLogger)

// The route handler for the api/tasks route
app.use('/api/tasks', tasksRouter)

app.use(middlewear.unknownEndpoint)

app.use(middlewear.errorHandler)

export default app
