import { put, call, takeLatest, all } from "redux-saga/effects";
import { fetchHomeData, fetchHomeSuccess, fetchHomeFailure } from "./slice";
import { httpRequest, endPoints } from "@/request";

function* handleFetchHome() {
  try {
    // Individual wrappers to prevent one failure from blocking everything
    const fetchSafe = function* (endpoint) {
      try {
        return yield call(httpRequest.get, endpoint);
      } catch (e) {
        console.error(`Saga Fetch Error for ${endpoint}:`, e);
        return { data: [] }; // Return empty structure consistent with axios unwrap
      }
    };

    const [courses, mentors, ratings, about] = yield all([
      fetchSafe(endPoints.CourseList),
      fetchSafe(endPoints.MentorList),
      fetchSafe(endPoints.PlatformRatings),
      fetchSafe(endPoints.AboutSectionsList),
    ]);

    // Resilient data extraction helper
    const extractData = (payload) => {
      if (!payload) return [];
      
      // If it's the ApiResponse wrapper { success, data, message }
      let data = payload.data !== undefined ? payload.data : payload;
      
      // If the data itself has an 'items' array (pagination structure)
      if (data && data.items && Array.isArray(data.items)) return data.items;
      
      // If the data is already an array
      if (Array.isArray(data)) return data;
      
      return data ? (Array.isArray(data) ? data : [data]) : [];
    };

    yield put(fetchHomeSuccess({
      courses: extractData(courses),
      mentors: extractData(mentors),
      ratings: extractData(ratings),
      about: extractData(about)
    }));
  } catch (error) {
    yield put(fetchHomeFailure(error.message));
  }
}

export function* homeSaga() {
  yield takeLatest(fetchHomeData.type, handleFetchHome);
}
