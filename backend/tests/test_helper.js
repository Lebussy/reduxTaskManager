import Task from '../models/task.js'
import User from '../models/user.js'
import supertest from 'supertest'
import app from '../app.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const api = supertest(app)

// Keeping db interactions in the helper module means:
// re-usable and easily refactored code, for example if changing databases

const initialTasks = {
  firstUser: [
    {
      content: 'Write tests for tasks backend',
      done: false,
      position: 1
    },
    {
      content: 'Implement user routes',
      done: false,
      position: 2
    },
    {
      content: 'Test the user routes',
      done: false,
      position: 3
    },
    {
      content: 'Make a MVP for the frontend',
      done: true,
      position: 1
    },
    {
      content: 'Route the MVP for backend of tasks',
      done: true,
      position: 2
    }
  ],
  secondUser: [
    {
      content: 'Go to the gym today',
      done: false,
      position: 1
    },
    {
      content: 'Eat 100g protein',
      done: false,
      position: 2
    },
    {
      content: 'eat 5 fruit/veg',
      done: true,
      position: 1
    }
  ]
}


const initialUsers = [
  {
    username: 'firstUser',
    name: 'bob',
    password: 'iLikeBurger55'
  },
  {
    username: 'secondUser',
    name:'lina',
    password: 'iLikeSinging22'
  }
]

const initialiseTasks = async () => {
  // Delete all existing tasks
  await Task.deleteMany({})

  // Gets a user object to be the author of the tasks
  const {username} = initialUsers[0]
  const firstUser = await User.findOne({username})

  // Synchronously saves the initial tasks, and adds their ids to the db
  for (const task of initialTasks.firstUser){
    const newTask = new Task({...task, user: firstUser._id})
    await newTask.save()
    firstUser.tasks = firstUser.tasks.concat(newTask._id)
    await firstUser.save()
  }
}

const initialiseSecondUsersTasks = async () => {
  // Gets a second user to initialise second set of tasks
  const secondUsername = initialUsers[1].username
  const secondUser = await User.findOne({username: secondUsername})

  // Synchronously saves each of the initial tasks for the second user
  // Adds the id of the task to the array of tasks on the user document
  for (const task of initialTasks.secondUser){
    const newTask = new Task({...task, user: secondUser._id})
    await newTask.save()
    secondUser.tasks = secondUser.tasks.concat(newTask._id)
    await secondUser.save()
  }
}

// Initialises the database with some users
const initialiseUsers = async () => {
  try {
    // Removes all the users from the db
    await User.deleteMany({})

    // Creates and saves initial users
    // Array of promises, each waiting for the user to be saved
    const promises = initialUsers.map(async user => {
      const newUser = new User({
        username: user.username,
        name: user.name,
        passwordHash: await bcrypt.hash(user.password, 10)
      })
      await newUser.save()
    })
    await Promise.all(promises)
  } catch (error) {
    console.error('Error initializing users:', error)
  }
}

// Task data for adding to the database
const validTaskData = {
  content: 'Test adding a valid task',
  done: false,
  position: 100
}

// Valid user data for adding to the database
const validUserData = {
  username: 'validUsername',
  name: 'aValidName',
  password: 'exTRal00ng!'
}

// Returns the tasks currently in the DB
const tasksInDb = async () => {
  const tasksInDb = await Task.find({})
  if (tasksInDb){
    return tasksInDb
      .map(document => document.toJSON())
      .toSorted((a,b) => a.position - b.position)
  }
  return
}

// Returns the users currently in the DB
const usersInDb = async () => {
  const userDocuments = await User.find({})
  return userDocuments.map(doc => doc.toJSON())
}

// Returns a task object from the database
const getExistingTaskObject = async () => {
  const taskDoc = await Task.findOne({})
  const asObject = taskDoc.toJSON()
  return asObject
}

// Returns a user object from the database
const getExistingUserObject = async () => {
  const {username} = initialUsers[0]
  const userDoc = await User.findOne({username})
  const asObject = userDoc.toJSON()
  return asObject
}

// Searches for a task by id and returns the task as JSON
const getTaskObjectById = async (id) => {
  const taskDoc = await Task.findById(id)
  if (!taskDoc){
    return {}
  }
  const asObject = taskDoc.toJSON()
  return asObject
}

// Provides a way of deterministically sorting mongo documents by their ids
const documentIdSorter = (a, b) => {
  return a.id.localeCompare(b.id)
}

// Returns a valid bearer token for the user passed to it
const signForUser = user => {
  // Payload for the token
  const payload = {
    username: user.username,
    id: user._id
  }

  // Token 
  const token = jwt.sign(payload, process.env.SECRET, {expiresIn: 60*60})

  // Returns the token in the bearer scheme
  return `Bearer ${token}`
}

// Gets a valid authorisation token
const getValidBearerToken = async () => {
  // Gets the initiailsed user from the database to authenticate
  const {username} = initialUsers[0]
  const userToAuthenticate = await User.findOne({username})

  return signForUser(userToAuthenticate)
}

// Gets a valid authorisation token for the secondUser, using the bearer scheme
const getSecondUserBearerToken = async () => {
  // Gets the second user from the database
  const {username} = initialUsers[1]
  const secondUser = await User.findOne({username})

  return signForUser(secondUser)
}

// Gets a valid authorization token for a user that has written no tasks
const getValidNonAuthorBearerToken = async () => {
  // Gets the second initialised user from the database to create token from
  const {username} = initialUsers[1]
  const nonAuthor = await User.findOne({username})

  // token payload
  const tokenPayload = {
    username, 
    id: nonAuthor._id
  }

  // Returns a valid token with the user information for the non-author
  const token = jwt.sign(tokenPayload, process.env.SECRET, {expiresIn: 60 * 60})
  return `Bearer ${token}`
}

const decodeToken = token => {
  // Checks that the token exists
  if (!token){
    return null
  }
  // Checks if the token is valid, returns the decoded or null if invalid
  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    return decoded
  } catch (error) {
    console.error('decoding helper error, token invalid', error)
    return null
  }
}

// Returns an invalid jwt
const getInvalidToken = () => {
  const token = jwt.sign(initialUsers[0], 'wrong secret', {expiresIn: 60*60})
  return `Bearer ${token}`
}



export default { 
  initialTasks,
  initialUsers,
  initialiseTasks, 
  initialiseSecondUsersTasks,
  initialiseUsers,
  validTaskData, 
  validUserData,
  tasksInDb, 
  usersInDb,
  getExistingTaskObject, 
  getExistingUserObject,
  getTaskObjectById, 
  documentIdSorter,
  getValidBearerToken,
  getSecondUserBearerToken,
  getValidNonAuthorBearerToken,
  decodeToken,
  getInvalidToken
  
}