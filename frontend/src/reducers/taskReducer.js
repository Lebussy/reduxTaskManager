import { createSlice } from "@reduxjs/toolkit";
import taskService from '../services/tasks'

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [{content:"initial state", done: false, id: "1234", position: 1}],
  reducers: {
    appendTask (state, action) {
      state.push(action.payload)
    },
    setTasksData (state, action) {
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
export const { appendTask, setTasksData, replaceTask, removeTask } = taskSlice.actions

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
    dispatch(setTasksData(taskData))
  }
}

// This action creator returns an asynchronous action, that waits until the server responds with the updated task,
// Before dispatching an action to the store to update the data
export const updateTask = (updatedTask) => {
  console.log('updateTask action creator')
  return async (dispatch) => {
    const returnedTask = await taskService.updateTask(updatedTask)
    dispatch(replaceTask(returnedTask))
  }
}

export const deleteTask = (taskId) => {
  return async (dispatch) => {
    const status = await taskService.deleteTask(taskId)
    if (status === 204) {
      dispatch(removeTask(taskId))
    }
  }
}

export default taskSlice.reducer