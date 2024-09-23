const TaskForm = ({ handleSubmit, preFill = '' }) => {
  return (
    <form onSubmit={(event) => {
      event.preventDefault()
      const content = event.target.task.value
      handleSubmit(content)
      event.target.task.value = ''
    }}>
      <input defaultValue={preFill} type="text" name="task"/>
      <button type="submit">save</button>
    </form>
  )
}

export default TaskForm