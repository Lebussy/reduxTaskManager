import { createSlice } from "@reduxjs/toolkit";
import taskService from '../services/tasks'
import taskHelper from './reducerHelpers/tasksHelper'
import { addToLastDonePosition, addToLastNotDonePosition, setLastDonePosition, setLastNotDonePosition } from "./lastPositionsReducer";

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

// Synchronous action creators
export const { appendTask, setTaskData, replaceTask, removeTask } = taskSlice.actions

// Asynchronous action creator for creating a new note from the content passed to it.
// Performs the server request as well as the dispatch to the store once that has returned the added task
export const createTask = (content) => {
  return async (dispatch, getState) => {
    const nextPosition = getState().lastPositions.notDone + 1
    const newTask = {content, done: false, position: nextPosition}
    const created = await taskService.addTask(newTask)
    dispatch(appendTask(created))
    dispatch(addToLastNotDonePosition(1))
  }
}

// Thunk that first requests the task data from the server, and then with that data updates:
// - the tasks in the store
// - the last positions in the done and notDone lists
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

// Thunk returned by this function dispatches an update request to the server, with the updated task that was passed to it
// Once the server has responded, the task is replaced in the redux store
export const updateTask = (updatedTask) => {
  return async (dispatch) => {
    const returnedTask = await taskService.updateTask(updatedTask)
    dispatch(replaceTask(returnedTask))
  }
}

export const updateTasksAfterRemoving = (taskToRemove) => {
  return async (dispatch, getState) => {
    // Collects all tasks that have the same done status as the task to remove
    const tasksInListOfRemoving = getState().tasks.filter(task => task.done === taskToRemove.done)

    // Returns an array containing the tasks with shifted positions after the task is removed
    const shiftedTasks = taskHelper.shiftPositionsUpAfter(tasksInListOfRemoving, taskToRemove.position)

    // Transforms the array of tasks to an array of objects containing just the positions and ids
    const shiftedPositions = shiftedTasks.map(task => {
      return {id: task.id, position: task.position}
    })

    // Batch updates these tasks to the server and waits for the response
    const updatedTasks = await taskService.updateMultiple(shiftedPositions)

    // Dispatches replace actions for the updated tasks to the store
    updatedTasks.forEach(task => dispatch(replaceTask(task)))

    // Reduces the lastTaskPosition in the store for the list the task was in
    dispatch(taskToRemove.done
      ? addToLastDonePosition(-1)
      : addToLastNotDonePosition(-1)
    )
  }
}

export const toggleDone = (taskToToggle) => {
  // Async action creator for toggling the done state of a task.
  return async (dispatch, getState) => {

    // Calculates the position of the task in the new list, based on whether the task was in the done or notDone list
    const lastPositions = getState().lastPositions
    const nextPosition = (taskToToggle.done ? lastPositions.notDone : lastPositions.done) + 1

    // Dispatches the task with the toggled done, and updated task position
    const updatedTask = {...taskToToggle, done: !taskToToggle.done, position: nextPosition}
    dispatch(updateTask(updatedTask))

    // Increments the last task position state for the list the task was moved to
    dispatch(taskToToggle.done
      ? addToLastNotDonePosition(1)
      : addToLastDonePosition(1)
    )

    // Performs updates to tasks that need shifting after the task to toggle is removed
    dispatch(updateTasksAfterRemoving(taskToToggle))
  }
}

export const deleteTask = (taskToDelete) => {
  return async (dispatch) => {
    try {
      await taskService.deleteTask(taskToDelete.id)

      // Deletes the task from the store
      dispatch(removeTask(taskToDelete.id))

      // Performs the updates to the tasks that need shifting after the task to delete is deleted
      dispatch(updateTasksAfterRemoving(taskToDelete))

    } catch (error) {
      console.error(error)
      console.log('FAILED DELETION')
    }
  }
}

// Asynchronous action creator that takes a list of tasks, and the position change of a task
// Uses the task helper to return an array of tasks that change after the position change
export const changeTaskPosition = (tasks, fromPosition, toPosition) => {
  return async (dispatch) => { 
    try {
      const updatedTasks = taskHelper.updateTaskPositions(tasks, fromPosition, toPosition);
      updatedTasks.forEach(task => dispatch(replaceTask(task)));
      // Optimistically update the state before the server confirms the changes
      const IDsAndPositions = updatedTasks.map(task => {
        return {id: task.id, position: task.position}
      })
      await taskService.updateMultiple(IDsAndPositions);
    } catch (error) {
      console.error(error);
    }
  }
}

export default taskSlice.reducer