import express from 'express'
import cors from 'cors'

const app = express()

// Express.json() returns a middlewear for parsing json data into js objects, and assigning to 
// the data attribute of the request object
app.use(express.json())

//
app.use(cors())

let tasks = ['3h fso', '1h proj', 'batman']

app.get('/api/tasks', (req, res) => {
  res.json(tasks)
})

app.post('/api/tasks', (req, res) => {
  const newTask = req.body.content
  tasks.push(newTask)
  res.json(newTask)
}) 

app.listen(3001, () => {
  console.log("listening on port 3001")
})