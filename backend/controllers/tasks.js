import express from 'express'
const tasksRouter = express.Router()
import 'express-async-errors'
import User from '../models/user.js'
import Task from '../models/task.js'

// Route for retrieving all tasks,
// Uses populate method to include the name and username of task author
tasksRouter.get('/', async (req, res) => {
  const tasks = await Task.find({}).populate('user', {username: 1, name: 1})
  res.status(200).json(tasks)
})

// For posting a new task to the database
tasksRouter.post('/',  async (req, res) => {

  const body = req.body

  // Ensures the content and position is in the request
  if (!body.content){
    return res.status(400).json({error: 'content missing'})
  } else if (!body.position){
    return res.status(400).json({error: 'task position missing'})
  }

  // Fetches the document of the user who created it
  const user = await User.findById(body.userId)

  // The new task to add to the db
  const newTask = new Task({
    content: body.content,
    done: body.done || false,
    position: body.position,
    user: user.id
  })

  // Saves the task to the db 
  const savedTask = await newTask.save()

  // Concats the document id for the new task to the array of tasks on the user document
  user.tasks = user.tasks.concat(savedTask.id)
  await user.save()

  // Returns the saved task as the response
  res.status(201).json(savedTask)
})

// For patching multiple tasks
tasksRouter.patch('/batch', async (req, res) => {
  const tasksToUpdate = req.body;

  // For each of the updated task objects, a mongoose 'operation' is created
  const bulkOperations = tasksToUpdate.map(updated => {
    return {
      updateOne: {
        // The filter is specified, a mongo query style filter for selecting the tasks whos data should be updated
        filter: {_id : updated.id},
        // The method of the operation as the attribute name, the $set option sets the fields that are different
        update: {$set: updated}
      }
    }
  })

   // Bulk write takes all the operations and submits them as one mongo operation
   await Task.bulkWrite(bulkOperations);

   // Fetch the updated tasks based on their IDs
   const updatedTaskIds = tasksToUpdate.map(task => task.id);
   const updatedTasks = await Task.find({ _id: { $in: updatedTaskIds } });
 
   // Return the updated tasks
   res.status(200).json(updatedTasks);
})

// For patching data of a single task
tasksRouter.patch('/:id', async (req, res) => {
  const id = req.params.id
  const fieldsToUpdate = req.body

  // Finds the task and updates the specified fields
  // option {new=true} ensures the updated task is returned
  const updatedTask = await Task.findByIdAndUpdate(id, fieldsToUpdate,{new: true})

  res.status(200).json(updatedTask)
})

// For deleting a resource with the id given as a route parameter
tasksRouter.delete('/:id', async (req, res) => {
  // Deletes the task from the the database
  const id = req.params.id
  const deleted = await Task.findByIdAndDelete(id)

  // Filters the taskid from the array of tasks on the user document
  const user = await User.findById(deleted.user)
  user.tasks = user.tasks.filter(taskId => {
    const taskIdString = taskId.toJSON()
    return taskIdString !== id
  })
  // Saves the updated user document
  await user.save()
  res.status(204).json(deleted)
})

export default tasksRouter

