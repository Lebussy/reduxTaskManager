import { useEffect, useState } from "react"
import taskService from './services/tasks'
import TaskForm from "./components/TaskForm"

function App() {
  const [tasks, setTasks] = useState([])

  // temp controlled taskForm component
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    taskService.getTasks().then(taskData => setTasks(taskData))
  },[])

  const handleSubmit = async (content) => {
    const added = await taskService.addTask(content)
    setTasks(tasks.concat(added))
  }

  return (
    <>
      <div>tasks</div>
      {tasks.map(task => <div key={task}>{task}</div>)}
      <TaskForm newTask={newTask} setNewTask={setNewTask} handleSubmit={handleSubmit}/>
    </>
  )
}

export default App
