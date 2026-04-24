import { createSelector } from "@reduxjs/toolkit";

const selectProfileState = (state) => state.profileData;

export const selectProfileLoading = createSelector(
  [selectProfileState],
  (profile) => profile?.loading
);

export const selectProfileError = createSelector(
  [selectProfileState],
  (profile) => profile?.error
);
