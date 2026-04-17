/**
 * Api Endpoints
 * All Api's endpoint
 */

const endPoints = {
  // Auth
  AdminLogin: "/auth/adminLogin",
  AdminRegister: "/auth/adminRegister",
  UserLogin: "/auth/login",
  UserRegister: "/auth/register",
  SendOtp: "/auth/send-otp",
  VerifyOtp: "/auth/verify-otp",
  ForgotPassword: "/auth/forgot-password",
  ResetPassword: "/auth/reset-password",

  // Dashboard
  AnalysisUserData: "/adminDashboard/analysisUser",
  AllTeacher: "/adminDashboard/allTeacher",

  // Users
  UserList: "/users",
  UserById: "/users/getById",
  CreateUser: "/users/create",
  UpdateUser: "/users/update",
  UpdateByAdmin: "/users/updateByAdmin",
  DeleteUser: "/users/delete",
  UpdateUserStatus: "/users/updateStatus",
  RegisterByAdmin: "/users/registerByAdmin",

  // Course Category
  CourseCategoryList: "/courseCategory/list",
  CourseCategoryById: "/courseCategory/getById",
  CreateCourseCategory: "/courseCategory/create",
  UpdateCourseCategory: "/courseCategory/update",
  DeleteCourseCategory: "/courseCategory/delete",
  ReorderCourseCategory: "/courseCategory/reorder",

  // Course
  CourseList: "/courses",
  CourseById: "/courses/getById",
  CreateCourse: "/courses/create",
  UpdateCourse: "/courses/update",
  UpdateCourseStatus: "/courses/status",
  DeleteCourse: "/courses/delete",
  SyncCourseMedia: "/courses/sync-media",
  CourseContent: "/courses/content",

  // Course Modules
  ModuleList: "/modules",
  CreateModule: "/modules/create",
  UpdateModule: "/modules/update",
  DeleteModule: "/modules/delete",
  ReorderModules: "/modules/reorder",

  // Lessons
  LessonList: "/lessons",
  CreateLesson: "/lessons/create",
  UpdateLesson: "/lessons/update",
  DeleteLesson: "/lessons/delete",
  ReorderLessons: "/lessons/reorder",
  lesson_pages: "/lesson-pages",

  // Module Tests
  ModuleTest: "/module-tests",
  CreateModuleTest: "/module-tests/create",
  UpdateModuleTest: "/module-tests/update",
  TestQuestions: "/test-questions",
  ReorderQuestions: "/test-questions/reorder",

  // User Course
  UserCourseList: "/userCourse/list",
  UserCourseById: "/userCourse/getById",
  CreateUserCourse: "/userCourse/create",
  UpdateUserCourse: "/userCourse/update",
  DeleteUserCourse: "/userCourse/delete",

  // Gallery
  Gallery: "/gallery",
  GalleryCreate: "/gallery/create",
  GalleryDelete: "/gallery/delete",

  CourseCategoryOptions: "/courseCategory/options",
  UserOptions: "/users/options",
  MentorList: "/users/mentors",

  // Terms & Conditions
  TermsAndConditionsList: "/terms/list",
  TermsAndConditionsById: "/terms/getById",
  CreateTermsAndConditions: "/terms/create",
  UpdateTermsAndConditions: "/terms/update",
  DeleteTermsAndConditions: "/terms/delete",
  ReorderTermsAndConditions: "/terms/reorder",

  // Common
  FileUpload: "/file",
  CleanupFiles: "/file/cleanup",

  // FAQs
  FAQsList: "/faqs/list",
  FAQsById: "/faqs/getById",
  CreateFAQ: "/faqs/create",
  UpdateFAQ: "/faqs/update",
  DeleteFAQ: "/faqs/delete",
  ReorderFAQ: "/faqs/reorder",

  // About Sections
  AboutSectionsList: "/about-sections/list",
  AboutSectionsById: "/about-sections/getById",
  CreateAboutSection: "/about-sections/create",
  UpdateAboutSection: "/about-sections/update",
  DeleteAboutSection: "/about-sections/delete",
  ReorderAboutSection: "/about-sections/reorder",

  // Privacy Policies
  PrivacyPoliciesList: "/privacy-policies/list",
  PrivacyPoliciesById: "/privacy-policies/getById",
  CreatePolicy: "/privacy-policies/create",
  UpdatePolicy: "/privacy-policies/update",
  DeletePolicy: "/privacy-policies/delete",
  ReorderPolicy: "/privacy-policies/reorder",

  // Offline Batches
  OfflineBatchesList: "/batches/list",
  OfflineBatchesById: "/batches/getById",
  CreateOfflineBatch: "/batches/create",
  UpdateOfflineBatch: "/batches/update",
  DeleteOfflineBatch: "/batches/delete",
  BatchesByCourse: "/batches/course",

  // Ratings
  CourseRatings: "/course-ratings",
  PlatformRatings: "/platform-ratings",
}

export default endPoints;
