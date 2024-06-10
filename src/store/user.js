import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "client",
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { saveUserType } = user.actions;

export default user.reducer;
