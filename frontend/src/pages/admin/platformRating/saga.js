import { call, put, takeLatest } from "redux-saga/effects";
import { httpRequest } from "@/request";
import endPoints from "@/request/endpoints";
import { toast } from "react-toastify";
import {
  fetchPlatformRatings, fetchPlatformRatingsSuccess, fetchPlatformRatingsFailure,
  deletePlatformRating, deletePlatformRatingSuccess, deletePlatformRatingFailure
} from "./slice";

function* handleFetchPlatformRatings() {
  try {
    const response = yield call(httpRequest.get, endPoints.PlatformRatings);
    yield put(fetchPlatformRatingsSuccess(response.data));
  } catch (error) {
    yield put(fetchPlatformRatingsFailure(error.message));
  }
}

function* handleDeletePlatformRating(action) {
  try {
    yield call(httpRequest.delete, `${endPoints.PlatformRatings}/${action.payload}`);
    yield put(deletePlatformRatingSuccess());
    toast.success("Rating deleted successfully");
    yield put(fetchPlatformRatings());
  } catch (error) {
    yield put(deletePlatformRatingFailure(error.message));
    toast.error(error.message);
  }
}

export function* platformRatingSagas() {
  yield takeLatest(fetchPlatformRatings.type, handleFetchPlatformRatings);
  yield takeLatest(deletePlatformRating.type, handleDeletePlatformRating);
}
