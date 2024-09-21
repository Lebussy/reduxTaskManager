import { useEffect } from "react"
import TaskForm from "./components/TaskForm"
import { useDispatch} from "react-redux"
import { initialiseTasksData} from "./reducers/taskReducer"
import TasksDisplay from "./components/TasksDisplay"

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialiseTasksData())
  },[])

  return (
    <>
      <div>tasks</div>
      <TasksDisplay/>
      <TaskForm/>
    </>
  )
}

export default App
