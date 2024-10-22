import { useDispatch, useSelector } from "react-redux"
import { clearIsEdit } from "./reducers/isEditReducer"
import { appStyle } from "./AppStyles"
import TaskListsDiv from "./components/taskComponents/TaskListsDiv"
import NotificationDisplay from './components/NotificationDisplay'
import LoginForm from './components/LoginForm'
import {logOut} from "./reducers/userReducer"


const App = () => {
  const dispatch = useDispatch()

  const user = useSelector(store => store.user)

  const renderLogoutButton = () => {
    return (
      <>
        {user.name}
        <button onClick={()=> dispatch(logOut())}>Logout</button>
      </>
    )
  }

  return (
    <>
      <div style={appStyle} onClick={() => dispatch(clearIsEdit())}>
        {user.loggedIn && renderLogoutButton()}
        <h2>Task Manager Application</h2>
        <NotificationDisplay/>
        {user.loggedIn ? <TaskListsDiv/> : <LoginForm/>}
      </div>
    </>
  )
}

export default App
