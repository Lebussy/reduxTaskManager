import { useDispatch } from "react-redux"
import { logOut } from "../reducers/userReducer"
import { clearNotification } from "../reducers/notificationReducer"

const LogoutButton = () => {
  const dispatch = useDispatch()
  return (
    <>
      <button onClick={()=> {
        dispatch(logOut())
        dispatch(clearNotification())
      }}>Logout</button>
    </>
  )
}

export default LogoutButton