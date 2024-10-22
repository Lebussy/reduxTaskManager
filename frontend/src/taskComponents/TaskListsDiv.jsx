import { useEffect } from "react"
import { useDispatch} from "react-redux"
import { initialiseTasksData} from "../reducers/taskReducer"
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
      <h2>Tasks:</h2>
      <NotDoneTasksDisplay/>
      <h3>Done tasks:</h3>
      <DoneTasksDisplay/>
    </div>
  )
}

export default TaskListsDiv