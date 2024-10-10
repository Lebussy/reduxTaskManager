import mongoose from "mongoose";

// The mongoose schema for users defines a document with fields for username, names, passhash and an array of document ids
// The ref option in the tasks field is used for populating the array of document ids with the task objects
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name:{
    type: String,
    required: true
  },
  passwordHash:{
    type: String,
    required: true,
  },
  tasks: [
    {type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ]
})

const toJSONTransformFunction = (document, returnedObject) => {
  returnedObject.id = returnedObject._id
  delete returnedObject._id
  delete returnedObject.__v
  delete returnedObject.passwordHash
}

userSchema.set('toJSON', {
  transform: toJSONTransformFunction
})

export default mongoose.model('User', userSchema)