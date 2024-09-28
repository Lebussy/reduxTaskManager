import { useState } from "react"
import taskService from '../services/tasks'
import { useDispatch } from "react-redux"
import { updateTask } from '../reducers/taskReducer'

const Task = ({ task }) => {
  const [isEdit, setIsEdit] = useState(false)

  const dispatch = useDispatch()

  const handleDone = () => {
    console.log('done')
  }

  if (!isEdit) {
    return (
      <div>
        {task.content} {task.done ? '- done': '- '}
        <button onClick={() => setIsEdit(true)}>Edit</button>
        <button onClick={handleDone}>Done</button>
      </div>
    )
  } 

  const updateText = (newText) => {
    dispatch(updateTask(newText))
  }

  return (
    <form>

    </form>
  )
  
}

export default Task