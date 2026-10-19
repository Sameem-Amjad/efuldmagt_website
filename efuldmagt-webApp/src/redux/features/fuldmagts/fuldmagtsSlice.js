import { createSlice } from "@reduxjs/toolkit";

const fuldmagtsSlice = createSlice({
  name: "fuldmagts",
  initialState: {
    fuldmagts: [],
  },
  reducers: {
    setFuldmagts: (state, action) => {
      state.fuldmagts = action.payload;
    },
    clearFuldmagts: (state) => {
      state.fuldmagts = [];
    },
  },
});

export const { setFuldmagts, clearFuldmagts } = fuldmagtsSlice.actions;
export default fuldmagtsSlice.reducer;
