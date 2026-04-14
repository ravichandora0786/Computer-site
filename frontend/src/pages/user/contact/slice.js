import { createSlice } from "@reduxjs/toolkit";

const initialState = { loading: false, success: false, error: null };
const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    sendContactMessage: (state) => { state.loading = true; state.success = false; },
    sendContactSuccess: (state) => { state.loading = false; state.success = true; },
    sendContactFailure: (state, action) => { state.loading = false; state.error = action.payload; },
  },
});
export const { sendContactMessage, sendContactSuccess, sendContactFailure } = contactSlice.actions;
export default contactSlice.reducer;
