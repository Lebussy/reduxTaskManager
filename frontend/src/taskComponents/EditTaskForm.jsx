import { useDispatch } from "react-redux";
import { updateTask } from "../reducers/taskReducer";
import TaskForm from "./TaskForm";
import { clearIsEdit } from "../reducers/isEditReducer";

const EditTaskForm = ({ oldTask }) => {
  const dispatch = useDispatch()

  const handleTaskUpdate = (updatedContent) => {
    const updatedTask = {...oldTask, content: updatedContent}
    dispatch(updateTask(updatedTask))
    dispatch(clearIsEdit())
  }

  return (
    <TaskForm onClick={event => event.stopPropogation()} handleSubmit={handleTaskUpdate} preFill={oldTask.content} />
  )
}

export default EditTaskForm