import { useDispatch } from "react-redux";
import { updateTask } from "../../reducers/taskReducer";
import TaskForm from "./TaskForm";

const EditTaskForm = ({ oldTask }) => {
  const dispatch = useDispatch()

  const handleTaskUpdate = (updatedContent) => {
    const updatedTask = {...oldTask, content: updatedContent}
    dispatch(updateTask(updatedTask))
  }

  return (
    <div>
      <TaskForm handleSubmit={handleTaskUpdate} preFill={oldTask.content} />
    </div>
  )
}

export default EditTaskForm