import { call, put, takeLatest } from "redux-saga/effects";
import { httpRequest } from "@/request";
import endPoints from "@/request/endpoints";
import { toast } from "react-toastify";
import {
  fetchFaqs, fetchFaqsSuccess, fetchFaqsFailure,
  createFaq, createFaqSuccess, createFaqFailure,
  updateFaq, updateFaqSuccess, updateFaqFailure,
  deleteFaq, deleteFaqSuccess, deleteFaqFailure,
} from "./slice";

function* handleFetchFaqs() {
  try {
    const response = yield call(httpRequest.get, `${endPoints.FAQsList}?all=true`);
    yield put(fetchFaqsSuccess(response.data.items || response.data));
  } catch (error) {
    yield put(fetchFaqsFailure(error.message));
  }
}

function* handleCreateFaq(action) {
  const { onSuccess, onFailure, ...data } = action.payload;
  try {
    yield call(httpRequest.post, endPoints.CreateFAQ, data);
    yield put(createFaqSuccess());
    toast.success("FAQ created successfully");
    if (onSuccess) yield call(onSuccess);
    yield put(fetchFaqs());
  } catch (error) {
    yield put(createFaqFailure(error.message));
    toast.error(error.message);
    if (onFailure) yield call(onFailure);
  }
}

function* handleUpdateFaq(action) {
  const { id, onSuccess, onFailure, ...data } = action.payload;
  try {
    yield call(httpRequest.post, endPoints.UpdateFAQ, { id, ...data });
    yield put(updateFaqSuccess());
    toast.success("FAQ updated successfully");
    if (onSuccess) yield call(onSuccess);
    yield put(fetchFaqs());
  } catch (error) {
    yield put(updateFaqFailure(error.message));
    toast.error(error.message);
    if (onFailure) yield call(onFailure);
  }
}

function* handleDeleteFaq(action) {
  try {
    yield call(httpRequest.post, endPoints.DeleteFAQ, { id: action.payload });
    yield put(deleteFaqSuccess());
    toast.success("FAQ deleted successfully");
    yield put(fetchFaqs());
  } catch (error) {
    yield put(deleteFaqFailure(error.message));
    toast.error(error.message);
  }
}

export function* faqSagas() {
  yield takeLatest(fetchFaqs.type, handleFetchFaqs);
  yield takeLatest(createFaq.type, handleCreateFaq);
  yield takeLatest(updateFaq.type, handleUpdateFaq);
  yield takeLatest(deleteFaq.type, handleDeleteFaq);
}
