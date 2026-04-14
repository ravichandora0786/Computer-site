import { put, takeLatest, delay } from "redux-saga/effects";
import { sendContactMessage, sendContactSuccess, sendContactFailure } from "./slice";
import { toast } from "react-toastify";

function* handleSendContact(action) {
  try {
    yield delay(1500); // Simulate API call
    yield put(sendContactSuccess());
    toast.success("Message sent successfully!");
  } catch (error) {
    yield put(sendContactFailure(error.message));
    toast.error("Failed to send message");
  }
}

export function* contactSaga() {
  yield takeLatest(sendContactMessage.type, handleSendContact);
}
