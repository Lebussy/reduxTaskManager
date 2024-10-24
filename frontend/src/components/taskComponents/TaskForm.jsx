



const TaskForm = ({ handleSubmit, preFill = '', placeholder = '' }) => {
  
// stop prop only workd on the pure html elements 
  return (
    
    <form  onSubmit={(event) => {
      event.preventDefault()
      const content = event.target.task.value
      handleSubmit(content)
      event.target.task.value = ''
    }}>
      <input onClick={event => event.stopPropagation()} placeholder={placeholder} defaultValue={preFill} type="text" name="task"/>
      <button onClick={event => event.stopPropagation()} type="submit">save</button>
    </form>
  )
}

export default TaskForm