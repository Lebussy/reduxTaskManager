import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './reducers/taskReducer'
import isEditReducer from './reducers/isEditReducer'

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    isEdit: isEditReducer
  }
})

export default store