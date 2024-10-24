import { useDispatch } from "react-redux"
import userService from '../services/user'
import { notify } from "../reducers/notificationReducer"
import NewUserForm from "./NewUserForm"

const TaskUserRegistration = ({goLogin}) => {
  const dispatch = useDispatch()

  const registerUser = async (credentials) => {
    try {
      const userDetails = await userService.submitUser(credentials)
      console.log('############user created: details#####################')
      console.log(userDetails)
      dispatch(notify(userDetails.username + "created successfully!", 'USER CREATED', 5))
    } catch (error) {
      console.log('################user not created well#################')
      console.log(error.message)
      dispatch(notify(error.message + 'User not created', 'ERROR', 5))
    }
  }

  return (
    <div>
      <NewUserForm handleSubmit={registerUser}/>
      <button onClick={() => goLogin()}>Login</button>
    </div>
  )
}

export default TaskUserRegistration