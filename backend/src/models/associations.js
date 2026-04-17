import UserModel from './user.model.js'
import CourseCategoryModel from './courseCategory.model.js'
import CourseModel from './course.model.js'
import GalleryModel from './gallery.model.js'
import NotificationModel from './notification.model.js'
import OtpModel from './otp.model.js'
import OrderModel from './order.model.js'
import RequestModel from './request.model.js'
import TermsAndConditionsModel from './termsAndConditions.model.js'
import UserCourseModel from './userCourse.model.js'
import UserOtherDetailsModel from './userOtherDetails.model.js'
import CourseMediaModel from './courseMedia.model.js'
import CourseModuleModel from './courseModule.model.js'
import LessonModel from './lesson.model.js'
import LessonPageModel from './lessonPage.model.js'
import ModuleTestModel from './moduleTest.model.js'
import TestQuestionModel from './testQuestion.model.js'
import TestQuestionOptionModel from './testQuestionOption.model.js'
import LessonProgressModel from './lessonProgress.model.js'
import TestAttemptModel from './testAttempt.model.js'
import TestAttemptAnswerModel from './testAttemptAnswer.model.js'
import OfflineBatchModel from './offlineBatch.model.js'
import UserPageProgressModel from './userPageProgress.model.js'

// New Models
import PlatformRatingModel from './platformRating.model.js'
import CourseRatingModel from './courseRating.model.js'
import FAQModel from './faq.model.js'
import PrivacyPolicyModel from './privacyPolicy.model.js'
import AboutSectionModel from './aboutSection.model.js'

// RBAC Models
import RoleModel from './role.model.js'
import PermissionModel from './permission.model.js'
import ActivityMasterModel from './activityMaster.model.js'
import ActivityPermissionModel from './activityPermission.model.js'
import BlockedTokenModel from './blockedToken.model.js'

// User - Role
RoleModel.hasMany(UserModel, { foreignKey: 'role_id', as: 'users' })
UserModel.belongsTo(RoleModel, { foreignKey: 'role_id', as: 'role' })

// ActivityPermission - Role
RoleModel.hasMany(ActivityPermissionModel, { foreignKey: 'role_id', as: 'activity_permissions' })
ActivityPermissionModel.belongsTo(RoleModel, { foreignKey: 'role_id', as: 'role' })

// ActivityPermission - ActivityMaster
ActivityMasterModel.hasMany(ActivityPermissionModel, { foreignKey: 'activity_id', as: 'permissions' })
ActivityPermissionModel.belongsTo(ActivityMasterModel, { foreignKey: 'activity_id', as: 'activity' })

// User - UserOtherDetails
UserModel.hasOne(UserOtherDetailsModel, { foreignKey: 'user_id', as: 'other_details' })
UserOtherDetailsModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' })

// Course - CourseCategory
CourseCategoryModel.hasMany(CourseModel, { foreignKey: 'course_category_id', as: 'courses' })
CourseModel.belongsTo(CourseCategoryModel, { foreignKey: 'course_category_id', as: 'category' })

// User - Course (Author)
UserModel.hasMany(CourseModel, { foreignKey: 'author', as: 'authored_courses' })
CourseModel.belongsTo(UserModel, { foreignKey: 'author', as: 'author_details' })

// User - Notifications
UserModel.hasMany(NotificationModel, { foreignKey: 'user_id', as: 'notifications' })
NotificationModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' })

// User - Orders
UserModel.hasMany(OrderModel, { foreignKey: 'user_id', as: 'orders' })
OrderModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' })

// Course - Orders
CourseModel.hasMany(OrderModel, { foreignKey: 'course_id', as: 'orders' })
OrderModel.belongsTo(CourseModel, { foreignKey: 'course_id', as: 'course' })

// User - Requests
UserModel.hasMany(RequestModel, { foreignKey: 'user_id', as: 'requests' })
RequestModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' })

// Admin - Requests (Handle by)
UserModel.hasMany(RequestModel, { foreignKey: 'handle_by', as: 'handled_requests' })
RequestModel.belongsTo(UserModel, { foreignKey: 'handle_by', as: 'handler' })

// User - UserCourses
UserModel.hasMany(UserCourseModel, { foreignKey: 'user_id', as: 'enrolled_courses' })
UserCourseModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' })

// Course - UserCourses
CourseModel.hasMany(UserCourseModel, { foreignKey: 'course_id', as: 'user_courses' })
UserCourseModel.belongsTo(CourseModel, { foreignKey: 'course_id', as: 'course' })

// Course - Media
CourseModel.hasMany(CourseMediaModel, { foreignKey: 'course_id', as: 'media', onDelete: 'CASCADE' })
CourseMediaModel.belongsTo(CourseModel, { foreignKey: 'course_id', as: 'course' })

// Course - CourseModule
CourseModel.hasMany(CourseModuleModel, { foreignKey: 'course_id', as: 'modules', onDelete: 'CASCADE' })
CourseModuleModel.belongsTo(CourseModel, { foreignKey: 'course_id', as: 'course' })

// CourseModule - Lesson
CourseModuleModel.hasMany(LessonModel, { foreignKey: 'module_id', as: 'lessons', onDelete: 'CASCADE' })
LessonModel.belongsTo(CourseModuleModel, { foreignKey: 'module_id', as: 'module' })

// Lesson - LessonPage
LessonModel.hasMany(LessonPageModel, { foreignKey: 'lesson_id', as: 'pages', onDelete: 'CASCADE' })
LessonPageModel.belongsTo(LessonModel, { foreignKey: 'lesson_id', as: 'lesson' })

// CourseModule - ModuleTest
CourseModuleModel.hasOne(ModuleTestModel, { foreignKey: 'module_id', as: 'test', onDelete: 'CASCADE' })
ModuleTestModel.belongsTo(CourseModuleModel, { foreignKey: 'module_id', as: 'module' })

// ModuleTest - TestQuestion
ModuleTestModel.hasMany(TestQuestionModel, { foreignKey: 'test_id', as: 'questions', onDelete: 'CASCADE' })
TestQuestionModel.belongsTo(ModuleTestModel, { foreignKey: 'test_id', as: 'test' })

// TestQuestion - TestQuestionOption
TestQuestionModel.hasMany(TestQuestionOptionModel, { foreignKey: 'question_id', as: 'options', onDelete: 'CASCADE' })
TestQuestionOptionModel.belongsTo(TestQuestionModel, { foreignKey: 'question_id', as: 'question' })

// Course - OfflineBatch
CourseModel.hasMany(OfflineBatchModel, { foreignKey: 'course_id', as: 'batches', onDelete: 'CASCADE' })
OfflineBatchModel.belongsTo(CourseModel, { foreignKey: 'course_id', as: 'course' })

// User - LessonProgress
UserModel.hasMany(LessonProgressModel, { foreignKey: 'student_id', as: 'lesson_progress', onDelete: 'CASCADE' })
LessonProgressModel.belongsTo(UserModel, { foreignKey: 'student_id', as: 'student' })

// User - TestAttempt
UserModel.hasMany(TestAttemptModel, { foreignKey: 'student_id', as: 'test_attempts', onDelete: 'CASCADE' })
TestAttemptModel.belongsTo(UserModel, { foreignKey: 'student_id', as: 'student' })

// TestAttempt - TestAttemptAnswer
TestAttemptModel.hasMany(TestAttemptAnswerModel, { foreignKey: 'attempt_id', as: 'answers', onDelete: 'CASCADE' })
TestAttemptAnswerModel.belongsTo(TestAttemptModel, { foreignKey: 'attempt_id', as: 'attempt' })

// Platform Rating - User
UserModel.hasMany(PlatformRatingModel, { foreignKey: 'user_id', as: 'platform_ratings' })
PlatformRatingModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' })

// Course - CourseRating
CourseModel.hasMany(CourseRatingModel, { foreignKey: 'course_id', as: 'ratings', onDelete: 'CASCADE' })
CourseRatingModel.belongsTo(CourseModel, { foreignKey: 'course_id', as: 'course' })

// Lesson - LessonProgress
LessonModel.hasMany(LessonProgressModel, { foreignKey: 'lesson_id', as: 'userProgress', onDelete: 'CASCADE' })
LessonProgressModel.belongsTo(LessonModel, { foreignKey: 'lesson_id', as: 'lesson' })

// User - CourseRating
UserModel.hasMany(CourseRatingModel, { foreignKey: 'user_id', as: 'course_ratings' })
CourseRatingModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' })

// PrivacyPolicy - User (Updated by)
UserModel.hasMany(PrivacyPolicyModel, { foreignKey: 'updated_by', as: 'updated_policies' })
PrivacyPolicyModel.belongsTo(UserModel, { foreignKey: 'updated_by', as: 'admin' })

// User - UserPageProgress
UserModel.hasMany(UserPageProgressModel, { foreignKey: 'user_id', as: 'page_progress', onDelete: 'CASCADE' })
UserPageProgressModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' })

// LessonPage - UserPageProgress
LessonPageModel.hasMany(UserPageProgressModel, { foreignKey: 'page_id', as: 'user_progress', onDelete: 'CASCADE' })
UserPageProgressModel.belongsTo(LessonPageModel, { foreignKey: 'page_id', as: 'page' })

// Lesson - UserPageProgress
LessonModel.hasMany(UserPageProgressModel, { foreignKey: 'lesson_id', as: 'userPageProgress', onDelete: 'CASCADE' })
UserPageProgressModel.belongsTo(LessonModel, { foreignKey: 'lesson_id', as: 'lesson' })

export {
  UserModel,
  CourseCategoryModel,
  CourseModel,
  GalleryModel,
  NotificationModel,
  OtpModel,
  OrderModel,
  RequestModel,
  TermsAndConditionsModel,
  UserCourseModel,
  UserOtherDetailsModel,
  CourseMediaModel,
  CourseModuleModel,
  LessonModel,
  LessonPageModel,
  ModuleTestModel,
  TestQuestionModel,
  TestQuestionOptionModel,
  LessonProgressModel,
  TestAttemptModel,
  TestAttemptAnswerModel,
  OfflineBatchModel,
  RoleModel,
  PermissionModel,
  ActivityMasterModel,
  ActivityPermissionModel,
  BlockedTokenModel,
  PlatformRatingModel,
  CourseRatingModel,
  FAQModel,
  PrivacyPolicyModel,
  AboutSectionModel,
  UserPageProgressModel,
}
