const sortedDeepCopy = (tasks) => {
  const copy = tasks.map(task => ({...task}))
  return copy.toSorted((a,b) => a.position - b.position)
}

const updateTaskPositions = (tasks, fromPosition, toPosition) => {
  // Redux state arrays, and objects within them are immutable
  // This method creates a 'deep' copy of the array, creating new copies of each task
  let tasksCopy = sortedDeepCopy(tasks)

  // Task moving down the list
  if (fromPosition < toPosition) {
    // Gather the tasks in-between that need shifting
    tasksCopy = tasksCopy.slice(fromPosition - 1, toPosition)
    // Change the moving tasks position
    tasksCopy[0].position = toPosition
    // Reduce their position number of all the rest
    for (let i = 1; i < tasksCopy.length; i++) {
      tasksCopy[i].position -= 1
    }
    return tasksCopy
  }

  // Task moving up the list
  if (fromPosition > toPosition){
    // Gather tasks in-between that need shifting
    tasksCopy = tasksCopy.slice(toPosition - 1, fromPosition)
    // Change the moving tasks position
    tasksCopy[tasksCopy.length - 1].position = toPosition
    // Increase the position number of the rest
    for (let i = 0; i < tasksCopy.length - 1; i ++){
      tasksCopy[i].position += 1
    }
    return tasksCopy
  } 
}

// Takes an array of tasks and the position of a removed task and shifts it up
// returns an array of the tasks that need updating
const shiftPositionsUpTo = (tasks, toPosition) => {
  let tasksToShift = sortedDeepCopy(tasks).slice(toPosition + 1)

  if (tasksToShift.length > 0){
    tasksToShift = tasksToShift.map(task => {
      return {...task, position: task.position - 1}
    })
  }

  return tasksToShift
}

export default { updateTaskPositions, shiftPositionsUpTo }