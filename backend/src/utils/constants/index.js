export const USER_STATUS_ENUM = ["active", "inactive"];
export const COURSE_LEVEL_ENUM = ["beginner", "intermediate", "expert"];
export const COURSE_STATUS_ENUM = ["draft", "coming soon", "active", "inactive", "archived"];
export const GALLERY_TYPE_ENUM = ["image", "video", "youtube"];
export const GALLERY_CATEGORY_ENUM = ["building", "students", "classroom", "events", "faculty", "other"];
export const REQUEST_STATUS_ENUM = ["pending", "solved", "processing"];
export const ORDER_STATUS_ENUM = ["active", "complete", "pending"];
export const USER_TYPE_ENUM = ["admin", "student", "teacher"];
export const COURSE_TYPE_ENUM = ["Free", "Paid"];
export const ACCESS_TYPE_ENUM = ["Free", "Paid"];
export const COURSE_MODE_ENUM = ["Online", "Offline"];
export const CONTENT_TYPE_ENUM = ["text", "video", "pdf", "image", "link"];
export const QUESTION_TYPE_ENUM = ["single_choice", "multiple_choice", "true_false", "short_answer"];

export const ROLE_TYPE_ENUM = ["admin", "teacher", "student"];

export const ChatEventEnum = Object.freeze({
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  JOIN_CHAT_EVENT: "joinChat",
  LEAVE_CHAT_EVENT: "leaveChat",
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  NEW_CHAT_EVENT: "newChat",
  SOCKET_ERROR_EVENT: "socketError",
  STOP_TYPING_EVENT: "stopTyping",
  TYPING_EVENT: "typing",
  MESSAGE_DELETE_EVENT: "messageDeleted",
});
