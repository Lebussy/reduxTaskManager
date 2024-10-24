



const TaskForm = ({ handleSubmit, preFill = '', placeholder = '' }) => {
  
// 
  return (
    
    <form  onSubmit={(event) => {
      event.preventDefault()
      const content = event.target.task.value
      handleSubmit(content)
      event.target.task.value = ''
    }}>
      <input onClick={event => event.stopPropagation()} placeholder={placeholder} defaultValue={preFill} type="text" name="task"/>
      <button type="submit">save</button>
    </form>
  )
}

export default TaskForm