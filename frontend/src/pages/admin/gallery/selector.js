import { createSelector } from "@reduxjs/toolkit";

const selectGalleryState = (state) => state.gallery;

export const selectGalleryList = createSelector(
  [selectGalleryState],
  (state) => state?.galleryList || []
);

export const selectIsLoading = createSelector(
  [selectGalleryState],
  (state) => state?.loading || false
);

export const selectPagination = createSelector(
  [selectGalleryState],
  (state) => state?.pagination || { totalItems: 0, totalPages: 0, currentPage: 1, limit: 10 }
);
