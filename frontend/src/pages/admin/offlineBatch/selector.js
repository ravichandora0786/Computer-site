import { createSelector } from "@reduxjs/toolkit";

const selectOfflineBatchState = (state) => state.adminOfflineBatch;

export const selectOfflineBatchList = createSelector([selectOfflineBatchState], (state) => state?.list || []);
export const selectOfflineBatchLoading = createSelector([selectOfflineBatchState], (state) => state?.loading);
export const selectOfflineBatchError = createSelector([selectOfflineBatchState], (state) => state?.error);
