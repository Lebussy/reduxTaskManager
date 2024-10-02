import Task from '../models/task.js'

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

const getValidTaskObject = async () => {
  const taskDoc = await Task.findOne({})
  return taskDoc.toJSON()

}

const validTaskObject = {
  content: 'Test adding a valid task',
  done: false,
  position: 100
}

const getTaskObjectById = async (id) => {
  const taskDoc = await Task.findById(id)
  if (!taskDoc){
    return {}
  }
  return taskDoc.toJSON()
}

const initialiseDatabase = async () => {
  // Delete all tasks
  await Task.deleteMany({})
  // Create and save initial tasks
  await Task.insertMany(initialTasks)
  
}

const idTaskSorter = (a, b) => {
  return a.id.localeCompare(b.id)
}

export default { initialTasks, validTaskObject, tasksInDb, getValidTaskObject, getTaskObjectById, initialiseDatabase, idTaskSorter }