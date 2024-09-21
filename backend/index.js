import express from 'express'
import cors from 'cors'
import reqLogger from './middlewear/requestLogger.js'

const app = express()

// Express.json() returns a middlewear for parsing json data into js objects, and assigning to 
// the data attribute of the request object
app.use(express.json())

// Cors (cross-origin-reference-policy) is used to prevent session hijacking, ensuring that certain web resources can only be accessed from
// the same origin as that resource
app.use(cors())

app.use(reqLogger)

let tasks = [
  {
    content:'write the express server',
    category:'now',
    done: false,
    id:1
  },
  {
    content:'connect to mongoDB',
    category:'later',
    done: false,
    id:2
  },
  {
    content:'write the app frontend using redux <3',
    category:'later-later',
    done: false,
    id:3
  }
]

app.get('/api/tasks', (req, res) => {
  res.json(tasks)
})

app.post('/api/tasks', (req, res) => {
  const newTask = req.body.content
  tasks.push(newTask)
  res.json(newTask)
}) 

app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id)

  const updatedTask = req.body

  tasks = tasks.map(task => task.id !== id
    ? task
    : updatedTask
  )

  res.json(updatedTask).status(200)
})

app.listen(3001, () => {
  console.log("listening on port 3001")
})