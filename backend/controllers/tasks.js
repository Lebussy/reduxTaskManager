import express from 'express'
const tasksRouter = express.Router()
import 'express-async-errors'

import Task from '../models/task.js'

// Route for retrieving all tasks 
tasksRouter.get('/', async (req, res) => {
  const tasks = await Task.find({})
  res.json(tasks)
})

// For posting a new task to the database
tasksRouter.post('/',  async (req, res) => {

  const body = req.body

  if (!body.content){
    return res.status(400).json({error: 'content missing'})
  } else if (!body.position){
    return res.status(400).json({error: 'task position missing'})
  }

  const newTask = new Task({
    content: body.content,
    done: body.done || false,
    position: body.position
  })

  const savedTask = await newTask.save()
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
  const id = req.params.id
  const result = await Task.findByIdAndDelete(id)
  res.status(204).json(result)
})

export default tasksRouter

