import { asyncHandler } from '../utils/asyncHandler.js'
import sequelize from '../config/database.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { UserCourseModel, CourseModel, UserModel } from '../models/associations.js'

/** Get all user courses */
const getUserCourses = asyncHandler(async (req, res, next) => {
  const where = {}
  if (req.query.userId) where.userId = req.query.userId

  const courses = await UserCourseModel.findAll({
    where,
    include: [
      { model: CourseModel, as: 'course' },
      { model: UserModel, as: 'user' },
    ],
  })
  return res
    .status(200)
    .json(new ApiResponse(200, courses, responseMessage.fetched('User Courses')))
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
      throw new ApiError(400, 'You are already enrolled in this course');
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
    const userCourse = await UserCourseModel.findByPk(req.params.id, { transaction })
    if (!userCourse) {
      await transaction.rollback()
      return next(new ApiError(404, 'Enrollment record not found'))
    }
    await userCourse.update({ status: req.body.status }, { transaction })
    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, userCourse, responseMessage.statusUpdated('Enrollment')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

export default {
  getUserCourses,
  enrollCourse,
  updateEnrollmentStatus,
}
