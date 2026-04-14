import { createSelector } from "@reduxjs/toolkit";

const selectHomeState = (state) => state.home;

export const selectHomeData = createSelector(
  [selectHomeState],
  (home) => home?.data
);

export const selectHomeLoading = createSelector(
  [selectHomeState],
  (home) => home?.loading
);

export const selectHomeError = createSelector(
  [selectHomeState],
  (home) => home?.error
);
