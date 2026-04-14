import { createSlice } from "@reduxjs/toolkit";
const initialState = { data: null, loading: false };
const policySlice = createSlice({
  name: "policy",
  initialState,
  reducers: {
    fetchPolicyData: (state) => { state.loading = true; },
    fetchPolicySuccess: (state, action) => { state.loading = false; state.data = action.payload; },
  },
});
export const { fetchPolicyData, fetchPolicySuccess } = policySlice.actions;
export default policySlice.reducer;
