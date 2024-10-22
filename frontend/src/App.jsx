import { useEffect } from "react"
import { useDispatch} from "react-redux"
import { initialiseTasksData} from "./reducers/taskReducer"
import { clearIsEdit } from "./reducers/isEditReducer"
import { appStyle } from "./AppStyles"
import TaskListsDiv from "./taskComponents/TaskListsDiv"


const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialiseTasksData())
  },[])

  return (
    <div style={appStyle} onClick={() => dispatch(clearIsEdit())}>
      <TaskListsDiv/>
    </div>
  )
}

export default App
