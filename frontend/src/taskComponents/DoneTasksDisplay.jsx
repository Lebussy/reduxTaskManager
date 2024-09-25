import { useSelector } from "react-redux"
import Task from "./Task"

const DoneTasksDisplay = () => {
  const doneTasks = useSelector(store => store.tasks).filter(task => task.done)
  const lastDonePosition = useSelector(store => store.positions.lastPositions.done)
  const lastNotDonePosition = useSelector(store => store.positions.lastPositions.notDone)

  return (
    <>
      {doneTasks.map(task => 
        <Task key={task.id} task={task}/>
      )}
      <button onClick={() => {
        console.log('last done',lastDonePosition)
        console.log('last not done', lastNotDonePosition)
      }}></button>
    </>
  )
}

export default DoneTasksDisplay