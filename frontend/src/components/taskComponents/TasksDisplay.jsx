import { useDispatch } from "react-redux"
import Task from "./Task"
import { tasksDisplayStyle } from '../../AppStyles'
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { changeTaskPosition } from "../../reducers/taskReducer"

const TasksDisplay = ({ tasks}) => {
  const dispatch = useDispatch()

  // Handler for drag and drop event
  // Takes a result parameter, an object with source and destination attributes, amoungst other things
  const onDragEnd = ({source, destination}) => {

    if (destination === null){
      console.log('dropped into the ether, destination null')
      return
    } 

    if (source.index === destination.index){
      return
    }

    const fromPosition = source.index
    const toPosition = destination.index
    dispatch(changeTaskPosition(tasks, fromPosition, toPosition))

  }

  return (
    // DragDropContext can take three callbacks, but only onDragEnd is required
    // Droppable component renders its children using the render props pattern. This is where a react 
    // component takes a function as a child, which is then called by the component to render the children.
    // somtimes used to pass props to the components through the parameter of the function
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="taskDisplay">
        
        {(provided) => (
          <div style={tasksDisplayStyle} {...provided.droppableProps}
          ref={provided.innerRef}>
            {tasks.map(task => 
              <Task key={task.id} task={task}/>)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default TasksDisplay