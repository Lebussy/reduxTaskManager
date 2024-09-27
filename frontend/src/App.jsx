import { useEffect } from "react"
import { useDispatch} from "react-redux"
import { initialiseTasksData} from "./reducers/taskReducer"
import DoneTasksDisplay from './taskComponents/DoneTasksDisplay'
import NotDoneTasksDisplay from "./taskComponents/NotDoneTasksDisplay"
import { clearIsEdit } from "./reducers/isEditReducer"
import { appStyle } from "./AppStyles"


function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialiseTasksData())
  },[])

  return (
    <div style={appStyle} onClick={() => dispatch(clearIsEdit())}>
      <p>(Double-click to edit, drag and drop to re-order)</p>
      <h2>Tasks:</h2>
      <NotDoneTasksDisplay/>
      <h3>Done tasks:</h3>
      <DoneTasksDisplay/>
    </div>
  )
}

export default App
