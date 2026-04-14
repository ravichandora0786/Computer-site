import { createSelector } from "@reduxjs/toolkit";

const selectTermsAndConditionsState = (state) => state.termsAndConditions;

export const selectTermsAndConditionsList = createSelector(
  [selectTermsAndConditionsState],
  (state) => state.termsAndConditionsList
);

export const selectIsLoading = createSelector(
  [selectTermsAndConditionsState],
  (state) => state.loading
);

export const selectPagination = createSelector(
  [selectTermsAndConditionsState],
  (state) => state.pagination
);
