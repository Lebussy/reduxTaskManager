import { useDispatch } from "react-redux";
import { createTask} from "../reducers/taskReducer";
import TaskForm from "./TaskForm";

const NewTaskForm = () => {
  const dispatch = useDispatch()

  const createNewTask = (content) => {
    dispatch(createTask(content))
  }

  return (
    <TaskForm handleSubmit={createNewTask} placeholder='New task' ></TaskForm>
  )
}

export default NewTaskForm