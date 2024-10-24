import bcryptjs from 'bcryptjs'
import Task from './models/task.js'
import User from './models/user.js'
import bcrypt from 'bcryptjs'

const initialUsers = 
  [
    {
      username:'firstUser',
      name:'bart',
      password:'SuperStrong!',
      notes:[]
    },
    {
      username:'secondUser',
      name:'maggie',
      password:'SuperStrong!',
      notes:[]
    }
  ]

const initialisingTasks = [
  {
    content: 'deploy frontend',
    done: false,
    position: 1
  },
  {
    content: 'pick 4 slightly nicer colors for frontend',
    done: true,
    position: 1
  }
]

const resetDB = async () => {
  // For initialising the db with a user
  try {
    // Clears users from the db
    await User.deleteMany({})
    console.log('all users deleted')
    // Sets up a users to add to db
    for (const userToAdd of initialUsers){
      const initialUserWithPasswordHash = 
      {...userToAdd, 
        passwordHash: await bcrypt.hash(userToAdd.password, 10)
      }
      // Removes the password field
      delete initialUserWithPasswordHash.password
      const newUser = new User(initialUserWithPasswordHash)
      await newUser.save()
    }
    
  } catch (error) {
    console.error(error, 'could not initialise user')
  }

  // For initialising some tasks
  try {    
    // Deletes the tasks in the db
    await Task.deleteMany({})
    console.log('All tasks deleted')
    // Adds the initial tasks to the database, and concats the id of the new tasks to the array of tasks on the user doc
    const user = await User.findOne({username: initialUsers[0].username})
    for (const task of initialisingTasks){
      const newTask = new Task({...task, user: user.id})
      await newTask.save()
      user.tasks = user.tasks.concat(newTask.id)
      await user.save()
    }
    console.log('tasks in db initialised')
  } catch (error) {
    console.log('Could not initialise tasks', error.message)
  }
}

export default { resetDB }