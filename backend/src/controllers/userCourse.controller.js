import { asyncHandler } from '../utils/asyncHandler.js'
import sequelize from '../config/database.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { UserCourseModel, CourseModel, UserModel, RoleModel, CourseCategoryModel } from '../models/associations.js'

/** Get all user courses with enhanced filtering */
const getUserCourses = asyncHandler(async (req, res, next) => {
  const { userId, courseId, status } = req.query
  const where = {}
  
  if (userId) where.userId = userId
  if (courseId) where.courseId = courseId
  if (status) where.status = status

  const courses = await UserCourseModel.findAll({
    where,
    include: [
      { model: CourseModel, as: 'course', attributes: ['title', 'id', 'course_mode', 'access_type'] },
      { model: UserModel, as: 'user', attributes: ['user_name', 'email', 'phone', 'id'] },
    ],
    order: [['createdAt', 'DESC']]
  })
  return res
    .status(200)
    .json(new ApiResponse(200, courses, responseMessage.fetched('User Courses')))
})

/** Get aggregated enrollment stats for Admin */
const getEnrollmentStats = asyncHandler(async (req, res, next) => {
  // 1. Total enrollments per course
  const courseStats = await UserCourseModel.findAll({
    attributes: [
      'courseId',
      [sequelize.fn('COUNT', sequelize.col('UserCourse.id')), 'enrollmentCount']
    ],
    group: ['courseId', 'course.id'],
    include: [{ model: CourseModel, as: 'course', attributes: ['title'] }]
  })

  // 2. Total unique enrolled students
  const enrolledStudents = await UserCourseModel.count({
    distinct: true,
    col: 'userId'
  })

  // 3. User Breakdown by Role
  const [totalStudents, totalTeachers, totalAdmins, totalUsers] = await Promise.all([
    UserModel.count({ include: [{ model: RoleModel, as: 'role', where: { type: 'student' } }] }),
    UserModel.count({ include: [{ model: RoleModel, as: 'role', where: { type: 'teacher' } }] }),
    UserModel.count({ include: [{ model: RoleModel, as: 'role', where: { type: 'admin' } }] }),
    UserModel.count()
  ])

  // 4. Content Counts
  const [totalCourses, totalCategories, totalEnrollments] = await Promise.all([
    CourseModel.count(),
    CourseCategoryModel.count(),
    UserCourseModel.count()
  ])

  // 5. Average progress across all enrollments
  const avgProgressResult = await UserCourseModel.findAll({
    attributes: [
      [sequelize.fn('AVG', sequelize.col('progress')), 'avgProgress']
    ],
    raw: true
  })
  const avgProgress = Math.round(avgProgressResult[0]?.avgProgress || 0)

  // 6. Recent enrollments (last 10)
  const recentEnrollments = await UserCourseModel.findAll({
    limit: 10,
    order: [['createdAt', 'DESC']],
    include: [
      { model: CourseModel, as: 'course', attributes: ['title'] },
      { model: UserModel, as: 'user', attributes: ['user_name'] }
    ]
  })

  const stats = {
    courseStats,
    enrolledStudents,
    totalStudents,
    totalTeachers,
    totalAdmins,
    totalUsers,
    totalCourses,
    totalCategories,
    totalEnrollments,
    avgProgress,
    recentEnrollments
  }

  return res
    .status(200)
    .json(new ApiResponse(200, stats, 'Enrollment statistics fetched successfully'))
})

/** Enroll student in course */
const enrollCourse = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const { courseId, userId, progress, startDate, endDate, status } = req.body;
    
    // Safety check
    if (!courseId || !userId) {
      throw new ApiError(400, 'Course ID and User ID are required for enrollment');
    }

    // Check for duplicate enrollment
    const existingEnrollment = await UserCourseModel.findOne({
      where: { courseId, userId }
    });

    if (existingEnrollment) {
      throw new ApiError(400, 'Student is already enrolled in this course');
    }

    const payload = { courseId, userId, progress: progress || 0, startDate, endDate, status };
    const userCourse = await UserCourseModel.create(payload, { transaction })
    
    await transaction.commit()
    return res
      .status(201)
      .json(new ApiResponse(201, userCourse, 'Student enrolled successfully'))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Update enrollment status */
const updateEnrollmentStatus = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const { id, status, progress } = req.body;
    const userCourse = await UserCourseModel.findByPk(id || req.params.id, { transaction })
    
    if (!userCourse) {
      await transaction.rollback()
      return next(new ApiError(404, 'Enrollment record not found'))
    }
    
    const updateData = {}
    if (status) updateData.status = status
    if (progress !== undefined) updateData.progress = progress

    await userCourse.update(updateData, { transaction })
    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, userCourse, responseMessage.statusUpdated('Enrollment')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Unenroll student from course */
const unenrollCourse = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const { userCourseId } = req.body;
    const userId = req.user.id;

    if (!userCourseId) {
      throw new ApiError(400, 'Enrollment ID is required for unenrollment');
    }

    const { UserCourseModel, LessonProgressModel, TestAttemptModel, CourseModuleModel, ModuleTestModel } = await import('../models/associations.js')

    // 1. Find the enrollment to get the courseId
    const enrollment = await UserCourseModel.findOne({
      where: { id: userCourseId, userId }
    });

    if (!enrollment) {
      throw new ApiError(404, 'Enrollment record not found or access denied');
    }

    const courseId = enrollment.courseId;

    // 2. Delete Enrollment Record
    await UserCourseModel.destroy({
      where: { id: userCourseId },
      transaction
    });

    // 3. Delete Lesson Progress
    await LessonProgressModel.destroy({
      where: { student_id: userId, course_id: courseId },
      transaction
    });

    // 4. Delete Test Attempts
    const modules = await CourseModuleModel.findAll({ where: { course_id: courseId }, attributes: ['id'] });
    const moduleIds = modules.map(m => m.id);
    
    if (moduleIds.length > 0) {
      const tests = await ModuleTestModel.findAll({ where: { module_id: moduleIds }, attributes: ['id'] });
      const testIds = tests.map(t => t.id);
      
      if (testIds.length > 0) {
        await TestAttemptModel.destroy({
          where: { student_id: userId, test_id: testIds },
          transaction
        });
      }
    }

    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Unenrolled successfully. Progress data cleared.'))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

export default {
  getUserCourses,
  getEnrollmentStats,
  enrollCourse,
  updateEnrollmentStatus,
  unenrollCourse,
}
