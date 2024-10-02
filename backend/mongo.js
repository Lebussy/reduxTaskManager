import Task from './models/task.js'
import mongoose from 'mongoose'
import config from './utils/config.js'

await mongoose.connect(config.MONGODB_URI)

const oneTask = new Task({
  content: 'the first',
  done: false,
  position: 1
})

const twoTask = new Task({
  content: 'the second',
  done: false,
  position: 2
})

try {
  await oneTask.save()
  await twoTask.save()
  console.log('TwoTaskSAVEVEEEEEEEEEEEEEEEEEEED')
} catch (error) {
  console.log('NOT SAVEDDD')
}


await mongoose.connection.close()
