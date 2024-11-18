import { useDispatch, useSelector } from "react-redux"
import { clearIsEdit } from "./reducers/isEditReducer"
import { appStyle } from "./AppStyles"
import TaskListsDiv from "./components/taskComponents/TaskListsDiv"
import NotificationDisplay from './components/NotificationDisplay'
import LoginForm from './components/LoginForm'
import tasksService from './services/tasks'
import LogoutButton from "./components/LogoutButton"


const App = () => {
  const dispatch = useDispatch()

  // Gets the user object from the store
  const user = useSelector(store => store.user)

  // If a user is logged in and has a token associated with it, sets the auth token for axios requests
  if (user.loggedIn && user.token){
    tasksService.setAuthToken(user.token)
  }

  // Method for rendering the application
  const renderApplication = () => {
    return (
      <div style={appStyle} onClick={() => dispatch(clearIsEdit())} >
        {user.loggedIn && <LogoutButton/>}
        <h2>Task Manager Application</h2>
        <NotificationDisplay/>
        {user.loggedIn ? <TaskListsDiv/> : <LoginForm/>}
      </div>
    )
  }


  return (
    <>
      {renderApplication()}
    </>
  )
}

export default App
