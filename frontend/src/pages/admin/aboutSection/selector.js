import { createSelector } from "@reduxjs/toolkit";

const selectAboutSectionState = (state) => state.adminAboutSection;

export const selectAboutSectionList = createSelector([selectAboutSectionState], (state) => state?.list || []);
export const selectAboutSectionLoading = createSelector([selectAboutSectionState], (state) => state?.loading);
export const selectAboutSectionError = createSelector([selectAboutSectionState], (state) => state?.error);
