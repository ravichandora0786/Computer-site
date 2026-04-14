import { createSelector } from "@reduxjs/toolkit";
const selectFaqState = (state) => state.faq;
export const selectFaqData = createSelector([selectFaqState], (s) => s?.data);
export const selectFaqLoading = createSelector([selectFaqState], (s) => s?.loading);
