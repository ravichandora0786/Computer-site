import { createSelector } from "@reduxjs/toolkit";

const selectCourseState = (state) => state.courseData;

export const selectCourseList = createSelector(
  [selectCourseState],
  (state) => state?.courseList || []
);

export const selectCourseDetail = createSelector(
  [selectCourseState],
  (state) => state?.courseDetail
);

export const selectPagination = createSelector(
  [selectCourseState],
  (state) => state?.pagination || { totalItems: 0, totalPages: 0, currentPage: 1, limit: 10 }
);
