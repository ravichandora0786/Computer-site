import { createSelector } from "@reduxjs/toolkit";

const selectFaqState = (state) => state.adminFaq;

export const selectFaqList = createSelector([selectFaqState], (state) => state?.list || []);
export const selectFaqLoading = createSelector([selectFaqState], (state) => state?.loading);
export const selectFaqError = createSelector([selectFaqState], (state) => state?.error);
