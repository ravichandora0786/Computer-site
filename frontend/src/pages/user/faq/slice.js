import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

const initialState = { data: [], loading: false };
const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    fetchFaqData: (state) => { state.loading = true; },
    fetchFaqSuccess: (state, action) => { state.loading = false; state.data = action.payload; },
  },
});
export const { fetchFaqData, fetchFaqSuccess } = faqSlice.actions;
export const selectFaqState = (state) => state.faq;
export const selectFaqData = createSelector([selectFaqState], (s) => s?.data);
export default faqSlice.reducer;
