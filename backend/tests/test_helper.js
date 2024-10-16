import Task from '../models/task.js'
import User from '../models/user.js'
import supertest from 'supertest'
import app from '../app.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import user from '../models/user.js'

export const api = supertest(app)

// Keeping db interactions in the helper module means:
// re-usable and easily refactored code, for example if changing databases

const initialTasks = [
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
]

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
  // Delete all tasks
  await Task.deleteMany({})
  // Adds a user id to the task objects
  const user = await User.findOne({})


  // const tasksWithUser = initialTasks.map(task => {
  //   return {...task, user: user.id}
  // })
  // // Create and save initial tasks
  // await Task.insertMany(tasksWithUser)

  // Synchronously saves the initial tasks, and adds their ids to the db
  for (const task of initialTasks){
    const newTask = new Task({...task, user: user._id})
    await newTask.save()
    user.tasks = user.tasks.concat(newTask._id)
    await user.save()
  }
}

// Initialises the database with some users
const initialiseUser = async () => {
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
  const userDoc = await User.findOne({})
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

// Gets a valid authorisation token
const getValidBearerToken = async () => {
  // Gets the initiailsed user from the database to authenticate
  const {username} = initialUsers[0]
  const userToAuthenticate = await User.findOne({username})

  // Token payload
  const tokenPayload = {
    username,  
    id: userToAuthenticate._id
  }

  // Returns the new signed token valid for 1 hour
  const token = jwt.sign(tokenPayload, process.env.SECRET, {expiresIn: 60 * 60})
  return `Bearer ${token}`
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


export default { 
  initialTasks,
  initialUsers,
  initialiseTasks, 
  initialiseUser,
  validTaskData, 
  validUserData,
  tasksInDb, 
  usersInDb,
  getExistingTaskObject, 
  getExistingUserObject,
  getTaskObjectById, 
  documentIdSorter,
  getValidBearerToken,
  getValidNonAuthorBearerToken,
  decodeToken,
}