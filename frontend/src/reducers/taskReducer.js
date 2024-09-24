import { createSlice } from "@reduxjs/toolkit";
import taskService from '../services/tasks'
import taskHelper from './reducerHelpers/tasksHelper'

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [{content:"initial state", done: false, id: "1234", position: 1}],
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

export const deleteTask = (task) => {
  return async (dispatch, getState) => {
    const status = await taskService.deleteTask(task.id)
    if (status === 204) {
      dispatch(removeTask(task.id))
      const currentTasks = getState().tasks
      const tasksToReposition = taskHelper.shiftPositionsUpTo(currentTasks, task.id)
      tasksToReposition.forEach(task => dispatch(updateTask(task)))
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