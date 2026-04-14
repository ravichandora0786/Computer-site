import { createSelector } from "@reduxjs/toolkit";

const selectPlatformRatingState = (state) => state.adminPlatformRating;

export const selectPlatformRatingList = createSelector([selectPlatformRatingState], (state) => state?.list || []);
export const selectPlatformRatingLoading = createSelector([selectPlatformRatingState], (state) => state?.loading);
