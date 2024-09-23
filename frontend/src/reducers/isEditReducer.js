import { createSlice } from "@reduxjs/toolkit";

const isEditSlice = createSlice({
  name: 'isEdit',
  initialState: null,
  reducers: {
    setIsEdit(state, action) {
      return action.payload
    },
    clearIsEdit() {
      return null
    }
  }
})

export const {setIsEdit, clearIsEdit} = isEditSlice.actions

export default isEditSlice.reducer