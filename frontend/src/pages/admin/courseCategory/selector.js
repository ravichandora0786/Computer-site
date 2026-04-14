import { createSelector } from "@reduxjs/toolkit";

const selectCourseCategoryState = (state) => state.courseCategory;

export const selectCategoryList = createSelector(
  [selectCourseCategoryState],
  (state) => state?.categoryList || []
);

export const selectIsLoading = createSelector(
  [selectCourseCategoryState],
  (state) => state?.isLoading || false
);

export const selectPagination = createSelector(
  [selectCourseCategoryState],
  (state) => state?.pagination || { totalItems: 0, totalPages: 0, currentPage: 1, limit: 10 }
);
