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
