import { createSelector } from "@reduxjs/toolkit";

const selectCoursesState = (state) => state.courses;

export const selectCourseItems = createSelector(
  [selectCoursesState],
  (state) => state.items
);

export const selectCoursesLoading = createSelector(
  [selectCoursesState],
  (state) => state.loading
);

export const selectCoursesFilters = createSelector(
  [selectCoursesState],
  (state) => state.filters
);

export const selectCoursesPagination = createSelector(
  [selectCoursesState],
  (state) => state.pagination
);

export const selectCourseDetail = createSelector(
  [selectCoursesState],
  (state) => state.courseDetail
);

export const selectDetailLoading = createSelector(
  [selectCoursesState],
  (state) => state.detailLoading
);

export const selectDetailError = createSelector(
  [selectCoursesState],
  (state) => state.detailError
);
