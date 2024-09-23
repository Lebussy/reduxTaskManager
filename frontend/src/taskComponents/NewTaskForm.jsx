import { useDispatch } from "react-redux";
import { createTask} from "../reducers/taskReducer";
import TaskForm from "./TaskForm";

const NewTaskForm = () => {
  const dispatch = useDispatch()

  const createNewTask = (content) => {
    dispatch(createTask(content))
  }

  return (
    <TaskForm handleSubmit={createNewTask}></TaskForm>
  )
}

export default NewTaskForm