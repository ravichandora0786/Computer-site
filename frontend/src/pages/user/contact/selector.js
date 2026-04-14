import { createSelector } from "@reduxjs/toolkit";
const selectContactState = (state) => state.contact;
export const selectContactLoading = createSelector([selectContactState], (s) => s?.loading);
export const selectContactSuccess = createSelector([selectContactState], (s) => s?.success);
