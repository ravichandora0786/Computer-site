import { put, call, takeLatest, all } from "redux-saga/effects";
import { fetchHomeData, fetchHomeSuccess, fetchHomeFailure } from "./slice";
import { httpRequest, endPoints } from "@/request";

function* handleFetchHome() {
  try {
    console.log("Computer Site Debug: Starting full data fetch in saga...");
    
    // Fetch multiple data points for the professional homepage in parallel
    const [courses, mentors, ratings, about] = yield all([
      call(httpRequest.get, endPoints.CourseList),
      call(httpRequest.get, endPoints.MentorList),
      call(httpRequest.get, endPoints.PlatformRatings),
      call(httpRequest.get, endPoints.AboutSectionsList),
    ]);

    console.log("Computer Site Debug: Saga data fetched successfully", { courses, mentors, ratings, about });

    yield put(fetchHomeSuccess({
      courses: courses?.data?.items || [],
      mentors: mentors?.data || [],
      ratings: ratings?.data || [],
      about: about?.data || []
    }));
  } catch (error) {
    console.error("Computer Site Debug: Home Data Fetch FAILED", error);
    yield put(fetchHomeFailure(error.message));
  }
}

export function* homeSaga() {
  yield takeLatest(fetchHomeData.type, handleFetchHome);
}
