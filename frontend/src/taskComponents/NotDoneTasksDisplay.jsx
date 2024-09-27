import { useSelector } from "react-redux";
import TasksDisplay from './TasksDisplay'
import NewTaskForm from "./NewTaskForm";
import { tasksDisplayStyle } from "../AppStyles";

const NotDoneTasksDisplay = () => {
  const notDoneTasks = useSelector(store => store.tasks)
    .filter(task => !task.done)
    .toSorted((a,b) => a.position-b.position)
    
  return (
      <div style={{...tasksDisplayStyle, backgroundColor: '#E0E0E0'}}>
        <TasksDisplay tasks={notDoneTasks}/>
        <p></p>
        <NewTaskForm/>
      </div>
  )
}

export default NotDoneTasksDisplay