import express from 'express'
const tasksRouter = express.Router()
import 'express-async-errors'
import Task from '../models/task.js'
import middlewear from '../utils/middlewear.js'

tasksRouter.use(middlewear.userExtractor)

// Route for retrieving all tasks,
// Uses populate method to include the name and username of task author
// Only tasks of the user are returned
tasksRouter.get('/', async (req, res) => {
  // User making the request
  const user = req.user
  const tasks = await Task.find({user: user.id})
  res.status(200).json(tasks)
})

// For posting a new task to the database
tasksRouter.post('/',  async (req, res) => {

  // Body of the request
  const body = req.body

  // Ensures the content and position is in the request
  if (!body.content){
    return res.status(400).json({error: 'content missing'})
  } else if (!body.position){
    return res.status(400).json({error: 'task position missing'})
  }

  // The user that added the task
  const user = req.user

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

  // Updates from the request body
  const tasksToUpdate = req.body;

  // User making the bulk patch request
  const requestUser = req.user

  console.log('##############req user id###################')
  console.log(requestUser._id.toString())

  // Ensures that the user is authorised to update all the tasks in the request
  if (!tasksToUpdate.every(taskUpdate => {
    console.log('##############taskUpdate.user###################')
    console.log(taskUpdate.user)
    // For each of the task updates, ensures that the user making the request is the author
    return taskUpdate.user === requestUser._id.toString()
  })){
    return res.status(401).json({error: 'Not authorised to update all of those tasks'})
  }

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
   const updatedTasks = await Task.find({ _id: { $in: updatedTaskIds } })
 
   // Return the updated tasks
   res.status(200).json(updatedTasks);
})

// For patching data of a single task
tasksRouter.patch('/:id', async (req, res) => {

  // id of task to update
  const id = req.params.id

  // the task to update
  const taskToUpdate = await Task.findById(id)

  // returns the correct status and error if the task is not found
  if (!taskToUpdate){
    return res.status(204).json({error: 'could not find task to update'})
  }

  // checks that the request user is authorised to make the update
  if (!req.user._id.toString() === taskToUpdate.user.toString()){
    return res.status(401).json({error: 'you are not the author of that task'})
  }

  // fields to update
  const fieldsToUpdate = req.body

  // updates the fields of the task
  const updatedTask = await Task.findByIdAndUpdate(id, fieldsToUpdate,{new: true})


  res.status(200).json(updatedTask)
})

// For deleting a resource with the id given as a route parameter
tasksRouter.delete('/:id', async (req, res) => {

  // User of request and the task to delete
  const requestUser = req.user
  const taskToDelete = await Task.findById(req.params.id)

  // If the task is not found, status 204 returned (resource not found)
  if (!taskToDelete) {
    return res.status(204).end()
  }

  // If the user is not the author of the task, error message and status returned
  if (requestUser._id.toString() !== taskToDelete.user.toString()){
    return res.status(401).json({error: 'not authorised to delete that task'})
  }

  // Deletes the resource because the author of the task is the requests user
  const deleted = await Task.findByIdAndDelete(taskToDelete.id)

  // Filters the taskid from the array of tasks on the user document
  requestUser.tasks = requestUser.tasks.filter(taskId => {
    const taskIdString = taskId.toString()
    return taskIdString !== taskToDelete._id.toString()
  })

  // Saves the updated user document
  await requestUser.save()
  res.status(204).json(deleted)
})

export default tasksRouter

