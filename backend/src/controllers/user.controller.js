import { Op } from 'sequelize'
import { asyncHandler } from '../utils/asyncHandler.js'
import sequelize from '../config/database.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { UserModel, RoleModel } from '../models/associations.js'

/** Get all users */
const getUsers = asyncHandler(async (req, res, next) => {
  // Debug: Check which ID we are excluding
  const currentUserId = req.user?.id
  const { user_type } = req.query

  const where = {}

  if (currentUserId) {
    where.id = { [Op.ne]: currentUserId }
  }

  const include = [
    {
      model: RoleModel,
      as: 'role',
      attributes: ['id', 'name', 'type']
    }
  ]

  if (user_type) {
    where['$role.type$'] = user_type
  }

  const users = await UserModel.findAll({ where, include })
  return res
    .status(200)
    .json(new ApiResponse(200, users, responseMessage.fetched('Users')))
})

/** Get user by ID */
const getUserById = asyncHandler(async (req, res, next) => {
  const id = req.params.id || req.body.id
  const user = await UserModel.findByPk(id, {
    include: [{ model: RoleModel, as: 'role' }]
  })
  if (!user) {
    return next(new ApiError(404, responseMessage.notFound('User')))
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, responseMessage.fetched('User')))
})

/** Create user */
const createUser = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const user = await UserModel.create(req.body, { transaction })
    await transaction.commit()
    return res
      .status(201)
      .json(new ApiResponse(201, user, responseMessage.created('User')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Update user */
const updateUser = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const id = req.params.id || req.body.id
    if (!id) {
      await transaction.rollback()
      return next(new ApiError(400, "User ID is required"))
    }

    const user = await UserModel.findByPk(id, { transaction })
    if (!user) {
      await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('User')))
    }

    await user.update(req.body, { transaction })
    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, user, responseMessage.updated('User')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Delete user */
const deleteUser = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const id = req.params.id || req.body.id
    if (!id) {
      await transaction.rollback()
      return next(new ApiError(400, "User ID is required"))
    }

    const user = await UserModel.findByPk(id, { transaction })
    if (!user) {
      await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('User')))
    }

    await user.destroy({ transaction })
    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted('User')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Get user options for dropdowns */
const getUserOptions = asyncHandler(async (req, res, next) => {
  const { user_type } = req.query
  
  const users = await UserModel.findAll({
    where: { account_status: 'active' },
    include: [{
      model: RoleModel,
      as: 'role'
    }],
    attributes: ['id', 'user_name', 'email', 'father_name']
  })

  let filteredUsers = users
  if (user_type) {
    filteredUsers = users.filter(u => 
      u.role?.type?.toLowerCase() === user_type.toLowerCase()
    )
  }

  return res
    .status(200)
    .json(new ApiResponse(200, filteredUsers, 'User options fetched'))
})

/** Get dashboard stats for current user */
const getDashboardStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  
  // 1. Fetch User with Profile Data
  const user = await UserModel.findByPk(userId)
  if (!user) {
    return next(new ApiError(404, 'User not found'))
  }

  // 2. Calculate Profile Completion
  const profileFields = [
    'user_name', 'email', 'father_name', 'mother_name', 
    'nationality', 'phone', 'aadhar_card_number', 'profile_img', 
    'gender', 'date_of_birth', 'address', 'postal_code', 
    'country', 'designation'
  ]
  
  let filledFields = 0
  profileFields.forEach(field => {
    if (user[field] && user[field] !== '') filledFields++
  })
  
  const profileCompletion = Math.round((filledFields / profileFields.length) * 100)

  // 3. Fetch Enrolled Courses with Progress
  const { UserCourseModel, CourseModel, CourseMediaModel, CertificateModel, TestAttemptModel } = await import('../models/associations.js')
  
  const [enrolledCourses, certificates, testAttempts] = await Promise.all([
    UserCourseModel.findAll({
      where: { userId },
      include: [{ 
        model: CourseModel, 
        as: 'course',
        attributes: {
          include: [
            [
              sequelize.literal(`(
                SELECT COALESCE(AVG(rating), 0)
                FROM course_ratings
                WHERE course_ratings.course_id = \`course\`.id
              )`),
              'avg_rating'
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM course_ratings
                WHERE course_ratings.course_id = \`course\`.id
              )`),
              'total_reviews'
            ],
            [
              sequelize.literal(`(
                SELECT COALESCE(SUM(duration_min), 0)
                FROM lessons
                INNER JOIN course_modules ON lessons.module_id = course_modules.id
                WHERE course_modules.course_id = \`course\`.id
              )`),
              'total_duration_min'
            ]
          ]
        },
        include: [
          { model: UserModel, as: 'author_details', attributes: ['user_name'] },
          { model: CourseMediaModel, as: 'media' }
        ]
      }]
    }),
    CertificateModel.findAll({
      where: { userId, status: 'approved' },
      include: [{ model: CourseModel, as: 'course', attributes: ['title'] }]
    }),
    TestAttemptModel.findAll({
      where: { student_id: userId }
    })
  ])

  // Format courses for frontend
  const formattedCourses = enrolledCourses.map(ec => {
    const courseData = ec.course?.get({ plain: true }) || {};
    const media = courseData.media || [];
    const thumbnail = media.find(m => m.media_type === 'image')?.url || null;

    return {
      ...courseData,
      media,
      thumbnail,
      user_course_id: ec.id,
      id: ec.courseId,
      courseId: ec.courseId,
      progress: ec.progress,
      status: ec.status,
      timeRemaining: ec.status === 'completed' ? 'Completed' : 'In Progress',
      isEnrolled: true,
      updatedAt: ec.updatedAt
    };
  })

  // Calculate Aggregated Stats
  const avgProgress = formattedCourses.length > 0 
    ? Math.round(formattedCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / formattedCourses.length) 
    : 0;
    
  const avgScore = testAttempts.length > 0
    ? Math.round(testAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / testAttempts.length)
    : 0;

  return res
    .status(200)
    .json(new ApiResponse(200, {
      profileCompletion,
      enrolledCourses: formattedCourses,
      certificates: certificates, // Approved certificates
      avgProgress,
      avgScore,
      userName: user.user_name
    }, 'Dashboard stats fetched successfully'))
})

/** Update current user profile */
const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  const transaction = await sequelize.transaction()
  try {
    const user = await UserModel.findByPk(userId, { transaction })
    if (!user) {
      await transaction.rollback()
      return next(new ApiError(404, 'User not found'))
    }

    // Explicitly exclude sensitive fields
    const { email, phone, password, role_id, account_status, ...allowedData } = req.body

    await user.update(allowedData, { transaction })
    await transaction.commit()
    
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'Profile updated successfully'))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Get Mentors (publicly visible teachers) */
const getMentors = asyncHandler(async (req, res, next) => {
  const mentors = await UserModel.findAll({
    include: [{
      model: RoleModel,
      as: 'role',
      where: { type: 'teacher' },
      attributes: [] // Filter by role type but don't include role data in response
    }],
    where: {
      account_status: 'active'
    },
    attributes: ['id', 'user_name', 'profile_img', 'designation', 'phone', 'email']
  })

  return res
    .status(200)
    .json(new ApiResponse(200, mentors, 'Mentors fetched successfully'))
})

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserOptions,
  getDashboardStats,
  updateProfile,
  getMentors
}
