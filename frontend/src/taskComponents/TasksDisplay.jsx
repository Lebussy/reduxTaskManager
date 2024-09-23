import Task from "./Task"

const TasksDisplay = ({ tasks }) => {
  const tasksStyle = {
    display: 'block', // Ensure the div is a block element
    textAlign: 'left', // Align text to the left
  }

  return (
    <ul style={tasksStyle}>
      {tasks.map(task => 
        <Task key={task.id} task={task}/>
      )}
    </ul>
  )
}

export default TasksDisplay