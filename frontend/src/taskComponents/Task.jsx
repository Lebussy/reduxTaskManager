import EditTaskForm from "./EditTaskForm"
import { useDispatch } from "react-redux"
import { deleteTask, updateTask } from "../reducers/taskReducer"
import { buttonStyle } from "../styles/buttonStyle"
import { useSelector } from "react-redux"
import { setIsEdit } from "../reducers/isEditReducer"

const Task = ({ task }) => {
  // There is a cost decision to be made here:
  // Is it more expensive to useSelector for every task element to check if its being edited
  // or is it more expensive to raise the state but then re-render all the tasks when one is being edited
  const isEdit = useSelector(state => state.isEdit === task.id)

  const dispatch = useDispatch()

  const taskStyle = task.done
    ? { textDecoration: 'line-through' }
    : {}
  
  const renderEditButton = () => {
    return (
      <button style={buttonStyle} onClick={() => dispatch(setIsEdit(task.id))}>edit</button>
    )
  }

  if (!isEdit) {
    return (
      <li style={taskStyle}>
        {task.content + ' '}
        <button style={buttonStyle} onClick={() => dispatch(updateTask({...task, done: !task.done}))}>
          {task.done? 'undo' : 'done'}
        </button>
        {!task.done && renderEditButton()}
        <button style={buttonStyle} onClick={() => dispatch(deleteTask(task.id))}>
          delete
        </button>
      </li>
    )
  } 

  return (
    <EditTaskForm oldTask={task}/>
  )
}

export default Task