import { createSelector } from "@reduxjs/toolkit";
const selectPolicyState = (state) => state.policy;
export const selectPolicyData = createSelector([selectPolicyState], (s) => s?.data);
export const selectPolicyLoading = createSelector([selectPolicyState], (s) => s?.loading);
