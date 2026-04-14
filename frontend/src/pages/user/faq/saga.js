import { put, takeLatest, call } from "redux-saga/effects";
import { fetchFaqData, fetchFaqSuccess } from "./slice";
import { httpRequest } from "@/request";
import endPoints from "@/request/endpoints";

function* handleFetchFaq() {
  try {
    const response = yield call(httpRequest.get, endPoints.FAQsList);
    yield put(fetchFaqSuccess(response?.data?.items || []));
  } catch (error) {
    console.error(error);
  }
}

export function* faqSaga() {
  yield takeLatest(fetchFaqData.type, handleFetchFaq);
}
