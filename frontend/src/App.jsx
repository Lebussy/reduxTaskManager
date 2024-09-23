import { useEffect } from "react"
import { useDispatch} from "react-redux"
import { initialiseTasksData} from "./reducers/taskReducer"
import NewTaskForm from "./taskComponents/NewTaskForm"
import DoneTasksDisplay from './taskComponents/DoneTasksDisplay'
import NotDoneTasksDisplay from "./taskComponents/NotDoneTasksDisplay"


function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialiseTasksData())
  },[])

  const appStyle = {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#74c4f4',
    width: 'fit-content',
    padding: '10px',
    maxHeight: '90vh', // Set a maximum height
    overflowY: 'auto' // Make it scrollable if content exceeds max height
  };

  return (
    <div style={appStyle}>
      <h2 >Tasks:</h2>
      <NotDoneTasksDisplay/>
      <h3>Create task:</h3>
      <NewTaskForm/>
      <h3>Done tasks:</h3>
      <DoneTasksDisplay/>
    </div>
  )
}

export default App
