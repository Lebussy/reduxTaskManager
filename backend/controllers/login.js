import express from "express";
const loginRouter = express.Router()
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

loginRouter.post('/', async (req, res) => {
  // Checks that the login request has both a username and password in the request body
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({error: 'username and password required for login'})
  }

  // Finds the user associated with the username
  const user = await User.findOne({username})
  
  // Checks that the username/password combo is correct, false if user with username not found
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  // Returns the correct error and status if the combo incorrect
  if (!passwordCorrect){
    return res.status(401).json({
      error: "username/password combination incorrect"
    })
  }

  // The information to be enCODEd before inclusion in the payload 
  const userPayloadForToken = {
    username: user.username,
    id: user._id
  }

  // The token, signed using the env.secret.
  // - when using jwt and a public key, the signing at the end ensures that the headers and payload have not been tampered with
  // -- when using a secret key, the info in the header and payload are un-tampered, and it is insured that it was signed by the server
  const token = jwt.sign(userPayloadForToken, process.env.SECRET, {expiresIn: 60*60})

  // Sends the token along with the username and the name of the user back to the client
  res.status(200).json({token, username: user.username, name: user.name})
})

export default loginRouter