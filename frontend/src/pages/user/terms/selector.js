import { createSelector } from "@reduxjs/toolkit";
const selectTermsState = (state) => state.terms;
export const selectTermsData = createSelector([selectTermsState], (s) => s?.data);
export const selectTermsLoading = createSelector([selectTermsState], (s) => s?.loading);
