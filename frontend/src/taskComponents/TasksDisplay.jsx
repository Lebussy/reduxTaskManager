import Task from "./Task"
import {tasksDisplayStyle} from './TasksDisplayStyle'

const TasksDisplay = ({ tasks }) => {

  return (
    
    <ul style={tasksDisplayStyle}>
      {tasks.map(task => 
        <Task key={task.id} task={task}/>
      )}
    </ul>
    
  )
}

export default TasksDisplay