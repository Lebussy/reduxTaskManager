import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 3
  },
  done: {
    type: Boolean,
    default: false
  },
  position: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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