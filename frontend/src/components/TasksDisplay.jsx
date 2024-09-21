import { useSelector } from "react-redux"
import Task from "./Task"

const TasksDisplay = () => {
  const taskData = useSelector(store => store.tasks)
  return (
    <>
      {taskData.map(task => 
        <Task key={task.id} task={task}/>
      )}
    </>
  )
}

export default TasksDisplay