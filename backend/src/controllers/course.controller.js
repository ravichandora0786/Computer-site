import { asyncHandler } from '../utils/asyncHandler.js'
import Sequelize from 'sequelize'
const { Op } = Sequelize
import sequelize from '../config/database.js'
import path from 'path'
import fs from 'fs'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { CourseModel, CourseCategoryModel, UserModel, CourseMediaModel } from '../models/associations.js'

/** Get all courses with pagination */
const getCourses = asyncHandler(async (req, res, next) => {
  const { category_id, access_type, course_mode, search } = req.query;
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const offset = (page - 1) * limit
 
  const where = {
    status: { [Op.ne]: 'draft' }
  };

  if (category_id) where.course_category_id = category_id;
  if (access_type) where.access_type = access_type;
  if (course_mode) where.course_mode = course_mode;
  if (search) {
    where.title = { [Op.like]: `%${search}%` };
  }

  const { count, rows: courses } = await CourseModel.findAndCountAll({
    where,
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COALESCE(AVG(rating), 0)
            FROM course_ratings
            WHERE course_ratings.course_id = Course.id
          )`),
          'avg_rating'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM course_ratings
            WHERE course_ratings.course_id = Course.id
          )`),
          'total_reviews'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM lessons
            INNER JOIN course_modules ON lessons.module_id = course_modules.id
            WHERE course_modules.course_id = Course.id
          )`),
          'total_lessons'
        ]
      ]
    },
    include: [
      { model: CourseCategoryModel, as: 'category' },
      { model: UserModel, as: 'author_details', attributes: ['id', 'user_name', 'email'] },
      { model: CourseMediaModel, as: 'media' },
    ],
    limit,
    offset,
    order: [[{ model: CourseMediaModel, as: 'media' }, 'order_index', 'ASC']]
  })

  const totalPages = Math.ceil(count / limit)

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        items: courses,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      responseMessage.fetched('Courses')
    )
  )
})

/** Get course by ID */
const getCourseById = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const course = await CourseModel.findByPk(id, {
    include: [
      { model: CourseCategoryModel, as: 'category' },
      { model: UserModel, as: 'author_details', attributes: ['id', 'user_name', 'email'] },
      { model: CourseMediaModel, as: 'media' },
    ],
    order: [[{ model: CourseMediaModel, as: 'media' }, 'order_index', 'ASC']]
  })
  if (!course) {
    return next(new ApiError(404, responseMessage.notFound('Course')))
  }
  return res
    .status(200)
    .json(new ApiResponse(200, course, responseMessage.fetched('Course')))
})

/** Create course */
const createCourse = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const { media, ...courseData } = req.body
    
    // Pricing Sanitization
    if (courseData.access_type === 'Free') {
      courseData.monthly_amount = 0;
      courseData.yearly_amount = 0;
      courseData.fixed_amount = 0;
      courseData.discount_amount = 0;
      courseData.discount_percentage = 0;
    }

    const course = await CourseModel.create(courseData, { transaction })

    if (media && Array.isArray(media)) {
      const mediaToCreate = media.map((item, index) => ({
        ...item,
        course_id: course.id,
        order_index: item.order_index ?? index,
      }))
      await CourseMediaModel.bulkCreate(mediaToCreate, { transaction })
    }

    await transaction.commit()

    // Refresh to get media (outside transaction since it's committed)
    const fullCourse = await CourseModel.findByPk(course.id, {
      include: [{ model: CourseMediaModel, as: 'media' }],
      order: [[{ model: CourseMediaModel, as: 'media' }, 'order_index', 'ASC']]
    })

    return res
      .status(201)
      .json(new ApiResponse(201, fullCourse, responseMessage.created('Course')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Update course */
const updateCourse = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const id = req.body.id || req.params.id
    if (!id) {
      await transaction.rollback()
      return next(new ApiError(400, "Course ID is required"))
    }

    const course = await CourseModel.findByPk(id, { transaction })
    if (!course) {
      await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('Course')))
    }

    const { media, ...courseData } = req.body

    // Pricing Sanitization
    if (courseData.access_type === 'Free') {
      courseData.monthly_amount = 0;
      courseData.yearly_amount = 0;
      courseData.fixed_amount = 0;
      courseData.discount_amount = 0;
      courseData.discount_percentage = 0;
    }

    await course.update(courseData, { transaction })

    if (media && Array.isArray(media)) {
      // 1. Delete media that aren't in the incoming array
      const incomingMediaIds = media.filter(m => m.id).map(m => m.id)
      await CourseMediaModel.destroy({
        where: {
          course_id: id,
          id: { [Op.notIn]: incomingMediaIds.length > 0 ? incomingMediaIds : ['0'] }
        },
        transaction
      })

      // 2. Add or Update remaining media
      const mediaOperations = media.map((item, index) => {
        const mediaItem = {
          ...item,
          course_id: id,
          order_index: item.order_index ?? index
        }
        if (item.id) {
          return CourseMediaModel.update(mediaItem, { where: { id: item.id }, transaction })
        } else {
          return CourseMediaModel.create(mediaItem, { transaction })
        }
      })
      await Promise.all(mediaOperations)
    }

    await transaction.commit()

    const updatedCourse = await CourseModel.findByPk(id, {
      include: [
        { model: CourseMediaModel, as: 'media' },
        { model: CourseCategoryModel, as: 'category' },
        { model: UserModel, as: 'author_details', attributes: ['id', 'user_name', 'email'] },
      ],
      order: [[{ model: CourseMediaModel, as: 'media' }, 'order_index', 'ASC']]
    })

    return res
      .status(200)
      .json(new ApiResponse(200, updatedCourse, responseMessage.updated('Course')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Delete course */
const deleteCourse = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const id = req.body.id || req.params.id
    if (!id) {
      await transaction.rollback()
      return next(new ApiError(400, "Course ID is required"))
    }

    // 1. Fetch course with media to identify files for deletion
    const course = await CourseModel.findByPk(id, {
      include: [{ model: CourseMediaModel, as: 'media' }],
      transaction
    })

    if (!course) {
      await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('Course')))
    }

    // 2. Cleanup physical files from storage
    if (course.media && Array.isArray(course.media)) {
      course.media.forEach(item => {
        if (item.url && !item.url.startsWith('http')) { // Only delete local files, not YouTube
          try {
            // Convert /media/course/filename to physical path
            // item.url starts with /media
            const relativePath = item.url.replace(/^\/media/, 'public/media');
            const absolutePath = path.join(process.cwd(), relativePath);
            if (fs.existsSync(absolutePath)) {
              fs.unlinkSync(absolutePath);
            }
          } catch (err) {
            console.error(`Failed to delete physical file: ${item.url}`, err);
          }
        }
      });
    }

    // 3. Destroy the course record (Cascade will handle DB media cleanup)
    await course.destroy({ transaction })
    await transaction.commit()

    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted('Course')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Sync course media assets */
const syncCourseMedia = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const { id: courseId } = req.params
    const { media } = req.body

    if (!courseId) {
      await transaction.rollback()
      return next(new ApiError(400, "Course ID is required"))
    }

    if (media && Array.isArray(media)) {
      // 1. Delete media that aren't in the incoming array
      const incomingMediaIds = media.filter(m => m.id).map(m => m.id)
      await CourseMediaModel.destroy({
        where: {
          course_id: courseId,
          id: { [Op.notIn]: incomingMediaIds.length > 0 ? incomingMediaIds : ['0'] }
        },
        transaction
      })

      // 2. Add or Update remaining media
      const mediaOperations = media.map((item, index) => {
        const mediaItem = {
          ...item,
          course_id: courseId,
          order_index: item.order_index ?? index
        }
        if (item.id) {
          return CourseMediaModel.update(mediaItem, { where: { id: item.id }, transaction })
        } else {
          return CourseMediaModel.create(mediaItem, { transaction })
        }
      })
      await Promise.all(mediaOperations)
    }

    await transaction.commit()

    const result = await CourseMediaModel.findAll({ 
      where: { course_id: courseId },
      order: [['order_index', 'ASC']]
    })

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Course media synchronized successfully'))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Update course status */
const updateCourseStatus = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const { id, status } = req.body
    if (!id || !status) {
      if (transaction) await transaction.rollback()
      return next(new ApiError(400, "Course ID and Status are required"))
    }

    const course = await CourseModel.findByPk(id, { transaction })
    if (!course) {
      if (transaction) await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('Course')))
    }

    await course.update({ status }, { transaction })
    await transaction.commit()

    return res
      .status(200)
      .json(new ApiResponse(200, course, 'Course status updated successfully'))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

export default {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  syncCourseMedia,
  updateCourseStatus,
}
