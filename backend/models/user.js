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
  returnedObject.id = returnedObject._id.toString()
  delete returnedObject._id
  delete returnedObject.__v
  delete returnedObject.passwordHash

  // For the returned user object, checks if there are tasks in the tasks array, and that the type is an ObjectId
  if (returnedObject.tasks && returnedObject.tasks.every(task => task instanceof mongoose.Types.ObjectId)){
    // Converts the array of objectIds to an array of id strings
    returnedObject.tasks = returnedObject.tasks.map(taskObjectId => taskObjectId.toString())
  }
}

userSchema.set('toJSON', {
  transform: toJSONTransformFunction
})

export default mongoose.model('User', userSchema)