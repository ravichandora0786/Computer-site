import { createSlice } from "@reduxjs/toolkit";
const initialState = { data: null, loading: false };
const termsSlice = createSlice({
  name: "terms",
  initialState,
  reducers: {
    fetchTermsData: (state) => { state.loading = true; },
    fetchTermsSuccess: (state, action) => { state.loading = false; state.data = action.payload; },
  },
});
export const { fetchTermsData, fetchTermsSuccess } = termsSlice.actions;
export default termsSlice.reducer;
