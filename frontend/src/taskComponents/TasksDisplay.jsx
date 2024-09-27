import Task from "./Task"
import {tasksDisplayStyle} from './TasksDisplayStyle'
import { DragDropContext, Droppable } from "@hello-pangea/dnd"

const TasksDisplay = ({ tasks }) => {

  const onDragEnd = () => {
    console.log('droppable dragged!')
  }

  return (
    // DragDropContext can take three callbacks, but only onDragEnd is required
    // Droppable component renders its children using the render props pattern. This is where a react 
    // component takes a function as a child, which is then called by the component to render the children.
    // somtimes used to pass props to the components through the parameter of the function
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="taskDisplay">
        {(provided) => (
          <ul style={tasksDisplayStyle} {...provided.droppableProps}
          ref={provided.innerRef}>
            {tasks.map(task => 
              <Task key={task.id} task={task}/>)}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default TasksDisplay