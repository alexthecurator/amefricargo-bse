import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modal: { on: false, id: "modal" },
};

const ui = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggle: (state, action) => {
      let { origin, status } = action?.payload ?? {};
      let cases = origin.toLowerCase();

      switch (cases) {
        case "modal":
          state.modal = status;
          break;
      }
    },
  },
});

export const { toggle } = ui.actions;

export default ui.reducer;
