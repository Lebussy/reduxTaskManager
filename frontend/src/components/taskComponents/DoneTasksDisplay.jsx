import { useSelector } from "react-redux"
import TasksDisplay from "./TasksDisplay"

const DoneTasksDisplay = () => {
  const doneTasks = useSelector(store => store.tasks)
    .filter(task => task.done)
    .toSorted((a,b) => a.position - b.position)
  return (
    <TasksDisplay tasks={doneTasks}/>
  )
}

export default DoneTasksDisplay