import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.set('strictQuery', false)

const uri = process.env.MONGODB_URI

console.log('connnecting to ', uri)

mongoose.connect(uri).then(result => {
  console.log('connected to mongoDB')
}).catch(error => console.log('error connecting to mongoDB', error.message))

const taskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  },
  position: {
    type: Number,
    required: true
  }
})

// schema.set(option, value) is used to set options for the schema
// This method sets the transform method that is used when the toJSON method is called
taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('Task', taskSchema)