import { useEffect } from "react"
import { useDispatch} from "react-redux"
import { initialiseTasksData} from "../../reducers/taskReducer"
import DoneTasksDisplay from './DoneTasksDisplay'
import NotDoneTasksDisplay from "./NotDoneTasksDisplay"

const TaskListsDiv = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialiseTasksData())
  },[])

  return (
    <div>
      <p>(Double-click to edit, drag and drop to re-order)</p>
      <h3>TODO:</h3>
      <NotDoneTasksDisplay/>
      <h3>Done:</h3>
      <DoneTasksDisplay/>
    </div>
  )
}

export default TaskListsDiv