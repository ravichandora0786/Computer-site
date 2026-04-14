import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import {
  getTermsAndConditions,
  createTermsAndConditions,
  updateTermsAndConditions,
  deleteTermsAndConditions,
  setLoading,
  setTermsAndConditionsList,
} from "./slice";
import endPoints from "../../../request/endpoints";
import { httpRequest } from "../../../request";

function* getTermsAndConditionsSaga(action) {
  const { page = 1, limit = 10, onSuccess, onFailure } = action.payload || {};
  yield put(setLoading(true));
  try {
    const response = yield call(httpRequest.get, `${endPoints.TermsAndConditionsList}?page=${page}&limit=${limit}`);
    yield put(setTermsAndConditionsList(response?.data?.items || response?.data || []));
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Failed to fetch terms";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  } finally {
    yield put(setLoading(false));
  }
}

function* createTermsAndConditionsSaga(action) {
  const { onSuccess, onFailure, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.CreateTermsAndConditions, data);
    toast.success(response?.message || "Terms created successfully");
    if (onSuccess) yield call(onSuccess, { message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Failed to create terms";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

function* updateTermsAndConditionsSaga(action) {
  const { id, onSuccess, onFailure, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.UpdateTermsAndConditions, { id, ...data });
    toast.success(response?.message || "Terms updated successfully");
    if (onSuccess) yield call(onSuccess, { message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Failed to update terms";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

function* deleteTermsAndConditionsSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.DeleteTermsAndConditions, { id });
    toast.success(response?.message || "Terms deleted successfully");
    if (onSuccess) yield call(onSuccess, { message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Failed to delete terms";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

export function* termsAndConditionsSagas() {
  yield takeLatest(getTermsAndConditions.type, getTermsAndConditionsSaga);
  yield takeLatest(createTermsAndConditions.type, createTermsAndConditionsSaga);
  yield takeLatest(updateTermsAndConditions.type, updateTermsAndConditionsSaga);
  yield takeLatest(deleteTermsAndConditions.type, deleteTermsAndConditionsSaga);
}
