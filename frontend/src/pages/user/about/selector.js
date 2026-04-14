import { createSelector } from "@reduxjs/toolkit";
const selectAboutState = (state) => state.about;
export const selectAboutData = createSelector([selectAboutState], (s) => s?.data);
export const selectAboutLoading = createSelector([selectAboutState], (s) => s?.loading);
