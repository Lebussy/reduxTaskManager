import { createSlice } from "@reduxjs/toolkit";
import taskService from '../services/tasks'
import taskHelper from './reducerHelpers/tasksHelper'
import { addToLastDonePosition, addToLastNotDonePosition, setLastDonePosition, setLastNotDonePosition } from "./positionsReducer";

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [{content:"loading tasks", done: false, id: "1234", position: 1}],
  reducers: {
    appendTask (state, action) {
      state.push(action.payload)
    },
    setTaskData (state, action) {
      return action.payload
    },
    replaceTask (state, action){
      return state.map(task => task.id !== action.payload.id
        ? task
        : action.payload
      )
    },
    removeTask (state, action){
      return state.filter(task => task.id !== action.payload)
    }
  }
})

// These action creators are exported
// Components can import and use these action creators using redux dispatch
export const { appendTask, setTaskData, replaceTask, removeTask } = taskSlice.actions

// These asynchronous action creators return thunks that perform asynchronous operations on the redux store
export const createTask = (content) => {
  return async (dispatch) => {
    const newTask = {content, done: false}
    const created = await taskService.addTask(newTask)
    dispatch(appendTask(created))
  }
}

export const initialiseTasksData = () => {
  return async (dispatch) => {
    const taskData = await taskService.getTasks()
    dispatch(setTaskData(taskData))
    const doneTasks = taskData.filter(task => task.done)
    const notDoneTasks = taskData.filter(task => !task.done)
    dispatch(setLastDonePosition(doneTasks.length))
    dispatch(setLastNotDonePosition(notDoneTasks.length))
  }
}

// This action creator returns an asynchronous action, that waits until the server responds with the updated task,
// Before dispatching an action to the store to update the data
export const updateTask = (updatedTask) => {
  return async (dispatch) => {
    const returnedTask = await taskService.updateTask(updatedTask)
    dispatch(replaceTask(returnedTask))
  }
}

export const toggleDone = (taskToToggle) => {
  // Async action creator for toggling the done state of a task.
  return async (dispatch, getState) => {
    // Calculates the position of the task in the new list, based on whether the task was in the done or notDone list
    const lastPositions = getState().positions.lastPositions
    const nextPosition = (taskToToggle.done ? lastPositions.notDone : lastPositions.done) + 1

    console.log('Next position', nextPosition)

    // Dispatches the task with the toggled done, and updated task position
    const updatedTask = {...taskToToggle, done: !taskToToggle.done, position: nextPosition}
    dispatch(updateTask(updatedTask))






    // For updating the positions in the list that the task was moved from

    const tasksToReposition = getState().tasks.filter(taskToToggle.done !== updatedTask.done)

    const repositionedTasks = taskHelper.shiftPositionsUpAfter(tasksToReposition, taskToToggle.position)















  }
}

export const deleteTask = (taskToDelete) => {
  return async (dispatch, getState) => {
    try {
      await taskService.deleteTask(taskToDelete.id)
      dispatch(removeTask(taskToDelete.id))

      // Gets the tasks that need shifting from the same list as the deleted task
      const tasksInSameList = getState().tasks.filter(currentTask => currentTask.done === taskToDelete.done)

      // Returns the shifted tasks that need updating from that list
      const repositionedTasks = taskHelper.shiftPositionsUpAfter(tasksInSameList, taskToDelete.position)

      // Batch updates the tasks on the server
      const updatedTasks = await taskService.updateMultiple(repositionedTasks)

      // Updated each task in the task store
      updatedTasks.forEach(task => dispatch(updateTask(task)))

      // Updates the last position count for the list the task was removed from
      if (taskToDelete.done){
        dispatch(addToLastDonePosition(-1))
      } else {
        dispatch(addToLastNotDonePosition(-1))
      }
    } catch (error) {
      console.error(error)
      console.log('FAILED DELETION')
    }
  }
}

// Asynchronous action creator that takes a list of tasks, and the position change of a task
// Uses the task helper to return an array of tasks that change after the position change
export const changeTaskPosition = (tasks, fromPosition, toPosition) => {
  const updatedTasks = taskHelper.updateTaskPositions(tasks, fromPosition, toPosition)
  return async (dispatch) => {
    const returnedTasks = await taskService.updateMultiple(updatedTasks)
    // Once the server returns the tasks with the updated positions, each task is replaced by dispatching the replaceTask action
    returnedTasks.forEach(task => dispatch(replaceTask(task)))
  }
}

export default taskSlice.reducer