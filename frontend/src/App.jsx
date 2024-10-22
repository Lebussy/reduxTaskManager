import { useEffect } from "react"
import { useDispatch} from "react-redux"
import { initialiseTasksData} from "./reducers/taskReducer"
import { clearIsEdit } from "./reducers/isEditReducer"
import { appStyle } from "./AppStyles"
import TaskListsDiv from "./components/taskComponents/TaskListsDiv"
import NotificationDisplay from './components/notificationComponents/NotificationDisplay'


const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialiseTasksData())
  },[])

  return (
    <div style={appStyle} onClick={() => dispatch(clearIsEdit())}>
      <NotificationDisplay/>
      <TaskListsDiv/>
    </div>
  )
}

export default App
