import { call, put, takeLatest } from "redux-saga/effects";
import { httpRequest } from "@/request";
import endPoints from "@/request/endpoints";
import { toast } from "react-toastify";
import {
  fetchCourseRatings, fetchCourseRatingsSuccess, fetchCourseRatingsFailure,
  deleteCourseRating, deleteCourseRatingSuccess, deleteCourseRatingFailure
} from "./slice";

function* handleFetchCourseRatings() {
  try {
    const response = yield call(httpRequest.get, endPoints.CourseRatings);
    yield put(fetchCourseRatingsSuccess(response.data));
  } catch (error) {
    yield put(fetchCourseRatingsFailure(error.message));
  }
}

function* handleDeleteCourseRating(action) {
  try {
    yield call(httpRequest.delete, `${endPoints.CourseRatings}/${action.payload}`);
    yield put(deleteCourseRatingSuccess());
    toast.success("Rating deleted successfully");
    yield put(fetchCourseRatings());
  } catch (error) {
    yield put(deleteCourseRatingFailure(error.message));
    toast.error(error.message);
  }
}

export function* courseRatingSagas() {
  yield takeLatest(fetchCourseRatings.type, handleFetchCourseRatings);
  yield takeLatest(deleteCourseRating.type, handleDeleteCourseRating);
}
