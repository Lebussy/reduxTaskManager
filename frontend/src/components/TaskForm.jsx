import { useDispatch } from "react-redux"
import { createTask } from "../reducers/taskReducer"

const TaskForm = () => {
  const dispatch = useDispatch()

  return (
    <form onSubmit={(event) => {
      event.preventDefault()
      const content = event.target.task.value
      dispatch(createTask(content))
      event.target.task.value = ''
    }}>
      <input type="text" name="task"/>
      <button type="submit">save</button>
    </form>
  )
}

export default TaskForm