import { call, put, takeLatest } from "redux-saga/effects";
import { httpRequest, endPoints } from "../../../request";
import { setLoading, setError, updateProfileTrigger } from "./slice";
import { updateProfileSuccess, setDashboardStats } from "../auth/slice";
import { toast } from "react-toastify";
import { setFullScreenLoader } from "../../admin/common/slice";

function* updateProfileSaga(action) {
  try {
    yield put(setFullScreenLoader(true));
    yield put(setLoading(true));
    
    const response = yield call(httpRequest.post, endPoints.UpdateUserProfile, action.payload);
    
    if (response) {
      yield put(updateProfileSuccess(response.data));
      
      // Refresh stats
      const statsResponse = yield call(httpRequest.get, endPoints.UserDashboardStats);
      if (statsResponse) {
        yield put(setDashboardStats(statsResponse.data));
      }
      
      toast.success("Profile updated successfully");
    }
  } catch (error) {
    console.error("Profile Update Error:", error);
    yield put(setError(error.response?.data?.message || "Failed to update profile"));
    toast.error(error.response?.data?.message || "Failed to update profile");
  } finally {
    yield put(setLoading(false));
    yield put(setFullScreenLoader(false));
  }
}

export default function* profileSaga() {
  yield takeLatest(updateProfileTrigger.type, updateProfileSaga);
}
