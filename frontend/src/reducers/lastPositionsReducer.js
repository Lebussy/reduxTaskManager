import { createSlice } from "@reduxjs/toolkit";

const positionsSlice = createSlice({
  name: 'lastPositions',
  initialState: {
    done: 0,
    notDone:0
  },
  reducers: {
    setLastDonePosition(state, action){
      state.done = action.payload
    },
    setLastNotDonePosition(state, action){
      state.notDone = action.payload
    },
    addToLastDonePosition(state, action){
      state.done += action.payload
    },
    addToLastNotDonePosition(state, action){
      state.notDone += action.payload
    },
    clearLastTaskPositions(_state, _action){
      return {done: 0, notDone: 0}
    }
    
  }
})

export const { setLastDonePosition, setLastNotDonePosition, addToLastDonePosition, addToLastNotDonePosition, clearLastTaskPositions } = positionsSlice.actions

export default positionsSlice.reducer