import express from 'express'
const usersRouter = express.Router()
import User from '../models/user.js'
import bycrypt from 'bcryptjs'
import middlewear from '../utils/middlewear.js'

// Uses the password strength validator
usersRouter.use(middlewear.passwordValidator)

usersRouter.post('/', async (req, res) => {
  // Ensures the request body contains both username and password
  const body = req.body
  if (!body.username || !body.password){
    return res.status(400).json({error: 'username and password required'})
  }

  // Creates a new user document
  const newUser = new User({
    name: body.name,
    username: body.username,
    passwordHash: await bycrypt.hash(body.password, 10)
  })

  // Awaits the user document to be saved and returns it in the response as json obj
  const savedUser = await newUser.save()
  return res.status(201).json(savedUser)
})

// Route for returning all the users
// Populate method on a query populates the fields that reference 'tasks'
// Mongo syntax used to select which of the populating documents fields are included
// Known as projecting syntax

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('tasks', {content: 1, done: 1})
  return res.status(200).json(users)
})

export default usersRouter