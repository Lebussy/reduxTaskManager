
import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import helper from './test_helper.js'
import { api } from './test_helper.js'

describe('When there are initially some users in the database', () => {
  // Initialises the database with two users
  beforeEach(async () => {
    try {
      await helper.initialiseUsers()
    } catch (error) {
      console.error('Error initializing users:', error)
    }
  })

  describe('creating a new user...', () => {
    // Asserts that the number of users increases and the username is in the usernames returned
    test('succeeds with valid data', async () => {
      // Gets the users at the start of the test
      const usersAtStart = await helper.usersInDb()
      // Posts the new user
      const {username, name, password} = helper.validUserData
      await api.post('/api/users')
        .send({username, name, password})
        .expect(201)
      // asserts the user count increases
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length -1, usersAtStart.length)
      // Asserts the new username is added correctly
      const usernames = usersAtEnd.map(user => user.username)
      assert(usernames.includes(username))
    })

    describe('but fails and returns correct status/message with...', () => {
      // Asserts correct behaviour with duplicate username
      test('a username that already exists', async () => {
        const usersAtStart = await helper.usersInDb()
        // Posts a user with an existing username
        const existingUser = await helper.getExistingUserObject()
        const response = await api.post('/api/users')
          .send({
            username: existingUser.username,
            name: 'alreadyTaken',
            password: 'Sekcret23!'
          })
          .expect(400)
        // Asserts that the error message contains 'duplicate key'
        assert(response.body.error.includes('duplicate key'))
        // Asserts that the number of users has not increased
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
      })

      // Asserts that adding a user with a weak password fails
      test('a too-weak password', async () => {
        const usersAtStart = await helper.usersInDb()
        // Adds a user with a password that is too weak
        const userToAdd = {...helper.validUserData, password: 'weak'}
        const response = await api.post('/api/users')
          .send(userToAdd)
          .expect(400)
        
        // Asserts that the correct error message is returned
        assert(response.body.error.includes('password'))

        // Asserts that no new users have been added to the database
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
      })
    })
  })

  describe('When there are some tasks in the database', async () => {
    beforeEach(async () => {
      try {
        await helper.initialiseTasks()
      } catch (error) {
        console.error('Error initializing tasks:', error)
      }
    })
  
    test('tasks are returned as json', async () => {
      await api
        .get('/api/tasks')
        .expect(200) // Assert that the status code is 200
        .expect('Content-Type', /application\/json/) // Assert that the Content-Type is JSON
    })
  
    test('correct number of tasks returned', async () => {
      const response = await api.get('/api/tasks')
      assert.strictEqual(response.body.length, helper.initialTasks.length)
    })
  
    test('All the contents of the tasks are returned correctly', async () => {
      const response = await api.get('/api/tasks')
      // Maps the contents of the returned tasks into an array
      const returnedContents = response.body.map(task => task.content)
      // Asserts that each of the initial task contents are in the returned contents array
      const initialTasksContents = helper.initialTasks.map(task => task.content)
      initialTasksContents.forEach(content => {
        assert(returnedContents.includes(content))
      })
    })
  
    describe('Deleting a task...', () => {
      
      test('succeeds with a correct id', async () => {
        const validTaskObject = await helper.getExistingTaskObject()
        const validID = validTaskObject.id
        await api.delete(`/api/tasks/${validID}`)
          .expect(204)
  
        const tasksAtEnd = await helper.tasksInDb()
  
        // Asserts that the number tasks in the db has been reduced by 1
        assert.strictEqual(helper.initialTasks.length, tasksAtEnd.length + 1)
  
        // Asserts that the content of the deleted task is not in the db
        const contentsAtEnd = tasksAtEnd.map(task => task.content)
        assert(!contentsAtEnd.includes(validTaskObject.content))
      })
  
      test('returns correct status and error message with malformed id', async () => {
        const response = await api.delete('/api/tasks/123')
          .expect(400)
      
        assert(response.body.error.toLowerCase().includes('malformatted id'))
      })
    })
  
    describe('Adding a new task...', () => {
  
      test('succeeds with valid task data', async () => {
        await api.post('/api/tasks')
          .send(helper.validTaskData)
          .expect(201)
          .expect('Content-Type', /application\/json/)
        
        // Asserts that there is an increase in the number of tasks
        const tasksAtEnd = await helper.tasksInDb()
        assert.strictEqual(tasksAtEnd.length - 1, helper.initialTasks.length)
  
        // Asserts that the content of the new task is in the db
        assert(tasksAtEnd.map(task => task.content).includes(helper.validTaskData.content))
      })
  
      test('fails with correct error code and message if content missing', async () => {
        // Posts a task with a missing content
        const response = await api.post('/api/tasks')
          .send({done: false,
            position: 1000
          })
          .expect(400)
  
        // Assert that the error message contains the word 'content'
        assert(response.body.error.includes('content'))
      })
  
      test('fails with correct error code and message if position missing', async () => {
        // Posts a task with a missing position
        const response = await api.post('/api/tasks')
          .send({content: 'task with position missing',
            done: false
          })
          .expect(400)
        
        // Assert that the error message contains the word 'position'
        assert(response.body.error.includes('position'))
      })
  
      test('fails with correct error code and message if content is too short', async () => {
        const response = await api.post('/api/tasks')
          .send({content: 'fo', done: false, position: 1000})
          .expect(400)
        
        assert(response.body.error.includes('content'))
      })
    })
  
    describe('updating...', () => {
        // Helper function to send a patch request and assert the response
        const patchTaskAndAssert = async (taskId, updateData, expectedTask) => {
          const response = await api.patch(`/api/tasks/${taskId}`)
            .send(updateData)
            .expect(200)
  
          assert.deepStrictEqual(response.body, expectedTask)
  
          const taskAtEnd = await helper.getTaskObjectById(taskId)
          assert.deepStrictEqual(taskAtEnd, expectedTask)
        }
  
        test('just the content succeeds', async () => {
          // Gets a task from the database
          const oldTaskObject = await helper.getExistingTaskObject()
          const update = {content: 'updated content in test'}
          const expectedTask = {...oldTaskObject, ...update}
  
          await patchTaskAndAssert(oldTaskObject.id, update, expectedTask)
        })
      
        test('just the done field succeeds', async () => {
          // Gets a task from the database
          const oldTaskObject = await helper.getExistingTaskObject()
          const update = {done: !oldTaskObject.done}
          const expectedTask = {...oldTaskObject, ...update}
  
          await patchTaskAndAssert(oldTaskObject.id, update, expectedTask)
        })
  
        test('just the position of the task succeeds', async () => {
          // Gets a task to updated from the database
          const oldTaskObject = await helper.getExistingTaskObject()
          const update = {position: 9090}
          const expectedTask = {...oldTaskObject, ...update}
  
          await patchTaskAndAssert(oldTaskObject.id, update, expectedTask)
        })
  
        test('a batch of changes succeeds', async () =>{
          // An array of objects with an id, and the content to update
          const tasksInDb = await helper.tasksInDb()
          const tasksToUpdate = tasksInDb.slice(0, 4)
          const updates = [
            {
              id: tasksToUpdate[0].id,
              content: 'content updated in a batch'
            },
            {
              id: tasksToUpdate[1].id,
              done: !tasksToUpdate[1].done
            },
            {
              id: tasksToUpdate[2].id,
              position: 3000
            },
            {
              id: tasksToUpdate[3].id,
              content: 'content, done and position updated',
              done: !tasksToUpdate[3].done,
              position: 4000
            }
          ]
  
          // Sends the updates to the /api/tasks/batch patch route
          const response = await api.patch('/api/tasks/batch')
            .send(updates)
            .expect(200)
  
          // Asserts that the server returns the tasks with the expected changes
          // Firsts sorts by id to ensure assert.deepStrictEqual functions correctly
          const expectedTasks = tasksToUpdate.map((task, index) => {
            return {...task, ...updates[index]}
          }).sort(helper.documentIdSorter)
  
          const returnedTasks = response.body.sort(helper.documentIdSorter)
          assert.deepStrictEqual(expectedTasks, returnedTasks)
        })
    })
  })
})

// Close the MongoDB connection after all tests are done
after(async () => {
  try {
    await mongoose.connection.close()
    console.log('MongoDB connection closed successfully.')
  } catch (error) {
    console.error('Error closing MongoDB connection:', error)
  }
})


