import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: null, loading: false, error: null };
const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    fetchAboutData: (state) => { state.loading = true; },
    fetchAboutSuccess: (state, action) => { state.loading = false; state.data = action.payload; },
    fetchAboutFailure: (state, action) => { state.loading = false; state.error = action.payload; },
  },
});
export const { fetchAboutData, fetchAboutSuccess, fetchAboutFailure } = aboutSlice.actions;
export default aboutSlice.reducer;
