import { put, takeLatest, call } from "redux-saga/effects";
import { fetchPolicyData, fetchPolicySuccess } from "./slice";
import { httpRequest } from "@/request";
import endPoints from "@/request/endpoints";

function* handleFetchPolicy() {
  try {
    const response = yield call(httpRequest.get, endPoints.PrivacyPoliciesList);
    yield put(fetchPolicySuccess(response?.data || []));
  } catch (error) {
    console.error(error);
  }
}

export function* policySaga() {
  yield takeLatest(fetchPolicyData.type, handleFetchPolicy);
}
