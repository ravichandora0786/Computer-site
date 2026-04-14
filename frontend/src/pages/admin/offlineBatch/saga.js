import { call, put, takeLatest } from "redux-saga/effects";
import { httpRequest } from "@/request";
import endPoints from "@/request/endpoints";
import { toast } from "react-toastify";
import {
  fetchBatches, fetchBatchesSuccess, fetchBatchesFailure,
  createBatch, createBatchSuccess, createBatchFailure,
  updateBatch, updateBatchSuccess, updateBatchFailure,
  deleteBatch, deleteBatchSuccess, deleteBatchFailure,
} from "./slice";

function* handleFetchBatches() {
  try {
    const response = yield call(httpRequest.get, endPoints.OfflineBatchesList); 
    yield put(fetchBatchesSuccess(response.data.items || response.data));
  } catch (error) {
    yield put(fetchBatchesFailure(error.message));
  }
}

function* handleCreateBatch(action) {
  const { onSuccess, onFailure, ...data } = action.payload;
  try {
    yield call(httpRequest.post, endPoints.CreateOfflineBatch, data);
    yield put(createBatchSuccess());
    toast.success("Batch created successfully");
    if (onSuccess) yield call(onSuccess);
    yield put(fetchBatches());
  } catch (error) {
    yield put(createBatchFailure(error.message));
    toast.error(error.message);
    if (onFailure) yield call(onFailure);
  }
}

function* handleUpdateBatch(action) {
  const { id, onSuccess, onFailure, ...data } = action.payload;
  try {
    yield call(httpRequest.post, endPoints.UpdateOfflineBatch, { id, ...data });
    yield put(updateBatchSuccess());
    toast.success("Batch updated successfully");
    if (onSuccess) yield call(onSuccess);
    yield put(fetchBatches());
  } catch (error) {
    yield put(updateBatchFailure(error.message));
    toast.error(error.message);
    if (onFailure) yield call(onFailure);
  }
}

function* handleDeleteBatch(action) {
  try {
    yield call(httpRequest.post, endPoints.DeleteOfflineBatch, { id: action.payload });
    yield put(deleteBatchSuccess());
    toast.success("Batch deleted successfully");
    yield put(fetchBatches());
  } catch (error) {
    yield put(deleteBatchFailure(error.message));
    toast.error(error.message);
  }
}

export function* offlineBatchSagas() {
  yield takeLatest(fetchBatches.type, handleFetchBatches);
  yield takeLatest(createBatch.type, handleCreateBatch);
  yield takeLatest(updateBatch.type, handleUpdateBatch);
  yield takeLatest(deleteBatch.type, handleDeleteBatch);
}
