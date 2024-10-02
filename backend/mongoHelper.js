import Task from './models/task.js'

const initialisingTasks = [
  {
    content: 'change routes to persist to mongo',
    done: false,
    position: 1
  },
  {
    content: 'update the patch route to minimise network data',
    done: false,
    position: 2
  },
  {
    content: 'change routes to use async/await',
    done: false,
    position: 3
  },
  {
    content: 'write mvp frontend',
    done: true,
    position: 1
  },
  {
    content: 'pick 4 slightly nicer colors for frontend',
    done: true,
    position: 2
  }
]

const resetDB = async () => {
  try {
    await Task.deleteMany({})
    console.log('All tasks deleted')
    const promises = initialisingTasks.map(task => {
      const newTask = new Task(task)
      return newTask.save()
    })
    await Promise.all(promises)
    console.log('tasks in db initialised')
  } catch (error) {
    console.log('Could not initialise tasks', error.message)
  }
}

export default { resetDB }