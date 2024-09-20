

const TaskForm = ({ newTask, setNewTask, handleSubmit }) => {
  return (
    <form onSubmit={() => handleSubmit(newTask)}>
      <input value={newTask} onChange={(event) => setNewTask(event.target.value)}/>
      <button type="submit">save</button>
    </form>
  )
}

export default TaskForm