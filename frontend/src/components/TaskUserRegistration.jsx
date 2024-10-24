import { useDispatch } from "react-redux"
import userService from '../services/user'
import { notify } from "../reducers/notificationReducer"
import NewUserForm from "./NewUserForm"

const TaskUserRegistration = ({goLogin}) => {
  const dispatch = useDispatch()

  const registerUser = async (credentials) => {
    try {
      const userDetails = await userService.submitUser(credentials)
      dispatch(notify(userDetails.username + "created successfully!", 'USER CREATED', 5))
      goLogin()
    } catch (error) {
      dispatch(notify(error.message + 'User not created', 'ERROR', 5))
    }
  }

  return (
    <div>
      <NewUserForm handleSubmit={registerUser}/>
      <button type='button' onClick={() => goLogin()}>Login</button>
    </div>
  )
}

export default TaskUserRegistration