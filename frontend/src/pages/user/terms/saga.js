import { put, takeLatest, call } from "redux-saga/effects";
import { fetchTermsData, fetchTermsSuccess } from "./slice";
import { httpRequest } from "@/request";
import endPoints from "@/request/endpoints";

function* handleFetchTerms() {
  try {
    const response = yield call(httpRequest.get, endPoints.TermsAndConditionsList);
    yield put(fetchTermsSuccess(response?.data || null));
  } catch (error) {
    console.error(error);
  }
}

export function* termsSaga() {
  yield takeLatest(fetchTermsData.type, handleFetchTerms);
}
