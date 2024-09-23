import { useSelector } from "react-redux"
import Task from "./Task"

const DoneTasksDisplay = () => {
  const doneTasks = useSelector(store => store.tasks).filter(task => task.done)

  return (
    <>
      {doneTasks.map(task => 
        <Task key={task.id} task={task}/>
      )}
    </>
  )
}

export default DoneTasksDisplay