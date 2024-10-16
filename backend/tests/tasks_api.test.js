
import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import helper from './test_helper.js'
import { api } from './test_helper.js'
import task from '../models/task.js'

describe('When there is initially one user in the database', () => {
  // Initialises the database with a user
  beforeEach(async () => {
    try {
      await helper.initialiseUser()
    } catch (error) {
      console.error('Error initializing users:', error)
    }
  })

  // Tests the login router
  describe('logging in...', () => {
    test('returns a valid token with correct credentials', async () => {
      // Sends login request
      const initialUser = helper.initialUsers[0]
      const response = await api.post('/api/login')
        .send({
          username: initialUser.username,
          password: initialUser.password
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // Asserts that a token is included in the response
      assert(response.body.token)

      // Asserts that the token is valid and contains the username of the user
      assert.strictEqual(helper.decodeToken(response.body.token).username, initialUser.username)
    })

    test('returns correct status and error message for incorrect password', async () => {
      // Sends a login request with incorrect password
      const initialUser = helper.initialUsers[0]
      const response = await api.post('/api/login')
        .send({
          username:initialUser.username,
          password:'incorrect'
        })
        // Asserts correct status code
        .expect(401)
        .expect('Content-Type', /application\/json/)
      
      // Asserts that the response contains appropriate error message
      assert(response.body.error.includes('incorrect'))
    })

    test('returns correct status and error message for invalid username', async () => {
      // Sends a login request with incorrect password
      const response = await api.post('/api/login')
        .send({
          username:'invalidUsername',
          password:'incorrect'
        })
        // Asserts correct status code
        .expect(401)
        .expect('Content-Type', /application\/json/)
      
      // Asserts that the response contains appropriate error message
      assert(response.body.error.includes('incorrect'))
    })
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
        .set('Authorization', await helper.getValidBearerToken())
        .expect(200) // Assert that the status code is 200
        .expect('Content-Type', /application\/json/) // Assert that the Content-Type is JSON
    })
  
    test('correct number of tasks returned', async () => {
      const response = await api.get('/api/tasks')
        .set('Authorization', await helper.getValidBearerToken())
      assert.strictEqual(response.body.length, helper.initialTasks.length)
    })
  
    test('All the contents of the tasks are returned correctly', async () => {
      const response = await api.get('/api/tasks')
        .set('Authorization', await helper.getValidBearerToken())
      // Maps the contents of the returned tasks into an array
      const returnedContents = response.body.map(task => task.content)
      // Asserts that each of the initial task contents are in the returned contents array
      const initialTasksContents = helper.initialTasks.map(task => task.content)
      initialTasksContents.forEach(content => {
        assert(returnedContents.includes(content))
      })
    })
  
    describe('Deleting a task...', () => {
      
      test('succeeds with a correct id and user', async () => {
        // Gets the list of task ids associated with the user at the start
        const userAuthor = await helper.getExistingUserObject()
        const usersTasksAtStart = userAuthor.tasks

        // Gets an existing tasks and requests to delete it
        const validTaskObject = await helper.getExistingTaskObject()
        const validID = validTaskObject.id
        await api.delete(`/api/tasks/${validID}`)
          .set('Authorization', await helper.getValidBearerToken())
          .expect(204)
  
        // Tasks in the database after the request as returned a response
        const tasksAtEnd = await helper.tasksInDb()
  
        // Asserts that the number tasks in the db has been reduced by 1
        assert.strictEqual(helper.initialTasks.length - 1 , tasksAtEnd.length)
  
        // Asserts that the content of the deleted task is not in the db
        const contentsAtEnd = tasksAtEnd.map(task => task.content)
        assert(!contentsAtEnd.includes(validTaskObject.content))

        // Asserts that deleting the task removes it from the tasks list on the user document
        const userObjectAfterDelete = await helper.getExistingUserObject()
        const usersTasksAtEnd = userObjectAfterDelete.tasks
        assert(usersTasksAtEnd.length === usersTasksAtStart.length - 1)
      })
  
      test('returns correct status and error message with malformed id', async () => {
        const response = await api.delete('/api/tasks/123')
          .set('Authorization', await helper.getValidBearerToken())
          .expect(400)
      
        assert(response.body.error.toLowerCase().includes('malformatted id'))
      })

      test('fails and returns the correct status and error message if user is not the author', async () => {
        // Tasks at the start of the database
        const tasksAtStart = await helper.tasksInDb()

        // Gets a task object from the database
        const taskObject = await helper.getExistingTaskObject()

        // Gets a non-author token
        const nonAuthorToken = await helper.getValidNonAuthorBearerToken()

        // Response from the server
        const response = await api.delete(`/api/tasks/${taskObject.id}`)
          .set('Authorization', nonAuthorToken)
          .expect(401)
          .expect('Content-Type', /application\/json/)

        // Asserts that that the correct error message is sent
        console.log('############error message from server#####################')
        console.log(response.body.error)
        assert(response.body.error.toLowerCase().includes('author '))

        // Asserts that the same number of tasks are in the database
        const tasksAtEnd = await helper.tasksInDb()
        assert.strictEqual(tasksAtStart.length, tasksAtEnd.length)
      })

    })  
  
    describe('Adding a new task...', () => {
      test('succeeds with valid task data', async () => {
        await api.post('/api/tasks')
          .set('Authorization', await helper.getValidBearerToken())
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
          .set('Authorization', await helper.getValidBearerToken())
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
          .set('Authorization', await helper.getValidBearerToken())
          .send({content: 'task with position missing',
            done: false
          })
          .expect(400)
        
        // Assert that the error message contains the word 'position'
        assert(response.body.error.includes('position'))
      })
  
      test('fails with correct error code and message if content is too short', async () => {
        const response = await api.post('/api/tasks')
          .set('Authorization', await helper.getValidBearerToken())
          .send({content: 'fo', done: false, position: 1000})
          .expect(400)
        
        assert(response.body.error.includes('content'))
      })
    })
  
    describe('updating...', () => {
        // Helper function to send a patch request and assert the response
        const patchTaskAndAssert = async (taskId, updateData, expectedTask) => {
          const response = await api.patch(`/api/tasks/${taskId}`)
            .set('Authorization', await helper.getValidBearerToken())
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
          const oldTaskObject = await helper.getExistingTaskObject()#
          // The update to send
          const update = {position: 9090}
          // How the task should be after the update
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
              content: 'content updated in a batch',
              user: tasksToUpdate[0].user
            },
            {
              id: tasksToUpdate[1].id,
              done: !tasksToUpdate[1].done,
              user: tasksToUpdate[1].user
            },
            {
              id: tasksToUpdate[2].id,
              position: 3000,
              user: tasksToUpdate[2].user
            },
            {
              id: tasksToUpdate[3].id,
              content: 'content, done and position updated',
              done: !tasksToUpdate[3].done,
              position: 4000,
              user: tasksToUpdate[3].user
            }
          ]
  
          // Sends the updates to the /api/tasks/batch patch route
          const response = await api.patch('/api/tasks/batch')
            .set('Authorization', await helper.getValidBearerToken())
            .send(updates)
            .expect(200)
  
          // Asserts that the server returns the tasks with the expected changes
          // Firsts sorts by id to ensure assert.deepStrictEqual functions correctly
          const expectedTasks = tasksToUpdate.map((task, index) => {
            return {...task, ...updates[index]}
          }).sort(helper.documentIdSorter)
  
          // Asserts that the tasks in the database are as expected
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


