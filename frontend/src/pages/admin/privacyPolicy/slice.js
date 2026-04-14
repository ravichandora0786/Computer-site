import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const policySlice = createSlice({
  name: "adminPrivacyPolicy",
  initialState,
  reducers: {
    fetchPolicies: (state) => { state.loading = true; },
    fetchPoliciesSuccess: (state, action) => { state.loading = false; state.list = action.payload; },
    fetchPoliciesFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    
    createPolicy: (state) => { state.loading = true; },
    createPolicySuccess: (state) => { state.loading = false; },
    createPolicyFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    
    updatePolicy: (state) => { state.loading = true; },
    updatePolicySuccess: (state) => { state.loading = false; },
    updatePolicyFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    deletePolicy: (state) => { state.loading = true; },
    deletePolicySuccess: (state) => { state.loading = false; },
    deletePolicyFailure: (state, action) => { state.loading = false; state.error = action.payload; },
  },
});

export const {
  fetchPolicies, fetchPoliciesSuccess, fetchPoliciesFailure,
  createPolicy, createPolicySuccess, createPolicyFailure,
  updatePolicy, updatePolicySuccess, updatePolicyFailure,
  deletePolicy, deletePolicySuccess, deletePolicyFailure
} = policySlice.actions;

export default policySlice.reducer;
