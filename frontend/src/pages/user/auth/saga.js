import { put, call, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { 
  userLoginRequest, 
  userLoginSuccess, 
  userLoginFailure,
  userRegisterRequest,
  userRegisterSuccess,
  userRegisterFailure
} from "./slice";
import { httpRequest, endPoints } from "../../../request";

function* handleUserLogin(action) {
  try {
    const response = yield call(httpRequest.post, endPoints.UserLogin, action.payload.data);
    yield put(userLoginSuccess(response.data));
    toast.success(response.message || "Login successful!");
    if (action.payload.onSuccess) {
       action.payload.onSuccess();
    }
  } catch (error) {
    yield put(userLoginFailure(error.message));
    toast.error(error.message || "Failed to login");
  }
}

function* handleUserRegister(action) {
  try {
    const response = yield call(httpRequest.post, endPoints.UserRegister, action.payload.data);
    yield put(userRegisterSuccess(response.data));
    toast.success(response.message || "Registration successful!");
    if (action.payload.onSuccess) {
       action.payload.onSuccess();
    }
  } catch (error) {
    yield put(userRegisterFailure(error.message));
    toast.error(error.message || "Failed to register");
  }
}

export function* userAuthSaga() {
  yield takeLatest(userLoginRequest.type, handleUserLogin);
  yield takeLatest(userRegisterRequest.type, handleUserRegister);
}
