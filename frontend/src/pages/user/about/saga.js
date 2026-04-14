import { put, takeLatest, call } from "redux-saga/effects";
import { fetchAboutData, fetchAboutSuccess, fetchAboutFailure } from "./slice";
import { httpRequest } from "@/request";
import endPoints from "@/request/endpoints";

function* handleFetchAbout() {
  try {
    const response = yield call(httpRequest.get, endPoints.AboutSectionsList);
    yield put(fetchAboutSuccess(response?.data || []));
  } catch (error) {
    yield put(fetchAboutFailure(error.message));
  }
}

export function* aboutSaga() {
  yield takeLatest(fetchAboutData.type, handleFetchAbout);
}
