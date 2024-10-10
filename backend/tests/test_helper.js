import Task from '../models/task.js'
import User from '../models/user.js'
import supertest from 'supertest'
import app from '../app.js'
import bcrypt from 'bcryptjs'
import task from '../models/task.js'

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
    username: 'secodnUser',
    name: 'linda',
    password: 'iLike5inging'
  }
]

const initialiseTasks = async () => {
  // Delete all tasks
  await Task.deleteMany({})
  // Adds a user id to the task objects
  const user = await User.findOne({})
  const tasksWithUser = initialTasks.map(task => {
    return {...task, user: user.id}
  })
  // Create and save initial tasks
  await Task.insertMany(tasksWithUser)
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

const validTaskData = {
  content: 'Test adding a valid task',
  done: false,
  position: 100
}

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
  return taskDoc.toJSON()
}

// Returns a user object from the database
const getExistingUserObject = async () => {
  const userDoc = await User.findOne({})
  return userDoc.toJSON()
}

const getTaskObjectById = async (id) => {
  const taskDoc = await Task.findById(id)
  if (!taskDoc){
    return {}
  }
  return taskDoc.toJSON()
}

// Provides a way of deterministically sorting mongo documents by their ids
const documentIdSorter = (a, b) => {
  return a.id.localeCompare(b.id)
}



export default { 
  initialTasks,
  initialUsers,
  initialiseTasks, 
  initialiseUsers,
  validTaskData, 
  validUserData,
  tasksInDb, 
  usersInDb,
  getExistingTaskObject, 
  getExistingUserObject,
  getTaskObjectById, 
  documentIdSorter,
  
}