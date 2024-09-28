import express from 'express'
import cors from 'cors'
import reqLogger from './middlewear/requestLogger.js'
import Task from './models/task.js'

const app = express()

// Express.json() returns a middlewear for parsing json data into js objects, and assigning to 
// the data attribute of the request object
app.use(express.json())

// Cors (cross-origin-reference-policy) is used to prevent session hijacking, ensuring that certain web resources can only be accessed from
// the same origin as that resource
app.use(cors())

app.use(reqLogger)


app.get('/api/tasks', (req, res) => {
  Task.find({}).then(tasks => res.json(tasks))
})

app.post('/api/tasks', (req, res) => {
  const newTask = new Task({...req.body})

  newTask.save()
    .then(task => res.status(201).json(task))
    .catch(error => {
      console.log('Error adding task', error.message)
      res.status(400).json ({error: error.message || 'could not add task'})})
}) 

app.put('/api/tasks/batch', (req, res) => {
  const updatedTasks = req.body;

  updatedTasks.forEach(updatedTask => {
    tasks = tasks.map(task => task.id !== updatedTask.id ? task : updatedTask);
  });

  console.log(updatedTasks);

  res.status(200).json(updatedTasks).end();
})

app.put('/api/tasks/:id', (req, res) => {
  const id = req.params.id

  const updatedTask = req.body

  tasks = tasks.map(task => task.id !== id
    ? task
    : updatedTask
  )

  res.json(updatedTask).status(200)
})

app.delete('/api/tasks/:id', (req, res) => {
  const id = req.params.id
  tasks = tasks.filter(task => task.id !== id)
  
  res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpiont'})
}

app.use(unknownEndpoint)


app.listen(3001, () => {
  console.log("listening on port 3001")
})