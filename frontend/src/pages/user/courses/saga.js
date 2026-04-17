import { put, call, takeLatest, select } from "redux-saga/effects";
import { fetchCourses, fetchCoursesSuccess, fetchCoursesFailure, fetchCourseDetail, fetchCourseDetailSuccess, fetchCourseDetailFailure } from "./slice";
import { httpRequest, endPoints } from "@/request";

const selectFilters = (state) => state.courses.filters;

function* handleFetchCourses(action) {
  try {
    const filters = yield select(selectFilters);
    const page = action.payload?.page || 1;
    
    // Construct query parameters
    const params = {
      page,
      limit: 12,
      ...filters
    };

    const response = yield call(httpRequest.get, endPoints.CourseList, { params });
    
    yield put(fetchCoursesSuccess({
      items: response?.data?.items || [],
      pagination: response?.data?.pagination || null
    }));
  } catch (error) {
    yield put(fetchCoursesFailure(error.message));
  }
}

function* handleFetchCourseDetail(action) {
  try {
    const response = yield call(httpRequest.get, `${endPoints.CourseById}/${action.payload}`);
    yield put(fetchCourseDetailSuccess(response.data));
  } catch (error) {
    yield put(fetchCourseDetailFailure(error.message));
  }
}

export function* coursesSaga() {
  yield takeLatest([fetchCourses.type, "courses/setFilters"], handleFetchCourses);
  yield takeLatest(fetchCourseDetail.type, handleFetchCourseDetail);
}
