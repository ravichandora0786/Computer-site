import { createSelector } from "@reduxjs/toolkit";

const selectCourseRatingState = (state) => state.adminCourseRating;

export const selectCourseRatingList = createSelector([selectCourseRatingState], (state) => state?.list || []);
export const selectCourseRatingLoading = createSelector([selectCourseRatingState], (state) => state?.loading);
