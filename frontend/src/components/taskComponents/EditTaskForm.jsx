import { useDispatch } from "react-redux";
import { updateTask } from "../../reducers/taskReducer";
import TaskForm from "./TaskForm";
import { useRef } from "react";
import { useEffect } from "react";

const EditTaskForm = ({ oldTask }) => {
  const dispatch = useDispatch()
  const formRef = useRef(null)

  useEffect(() => {
    if (formRef.current) {
      console.log('Form is connected to the DOM');
    } else {
      console.log('Form is NOT connected to the DOM');
    }
  }, []);

  const handleTaskUpdate = (updatedContent) => {
    const updatedTask = {...oldTask, content: updatedContent}
    dispatch(updateTask(updatedTask))
  }

  return (
    <div ref={formRef}>
      <TaskForm handleSubmit={handleTaskUpdate} preFill={oldTask.content} />
    </div>
  )
}

export default EditTaskForm