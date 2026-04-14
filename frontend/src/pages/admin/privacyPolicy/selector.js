import { createSelector } from "@reduxjs/toolkit";

const selectPolicyState = (state) => state.adminPrivacyPolicy;

export const selectPolicyList = createSelector([selectPolicyState], (state) => state?.list || []);
export const selectPolicyLoading = createSelector([selectPolicyState], (state) => state?.loading);
export const selectPolicyError = createSelector([selectPolicyState], (state) => state?.error);
