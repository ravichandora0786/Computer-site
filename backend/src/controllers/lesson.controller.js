import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import sequelize from '../config/database.js'
import { LessonModel } from '../models/associations.js'

/** Create lesson */
const createLesson = asyncHandler(async (req, res, next) => {
  const { module_id, title, short_description, lesson_order, duration_min, is_preview, status } = req.body
  if (!module_id || !title) {
    return next(new ApiError(400, 'Module ID and Title are required'))
  }
  const lesson = await LessonModel.create({
    module_id,
    title,
    short_description,
    lesson_order: lesson_order || 0,
    duration_min: duration_min || 0,
    status: status || 'draft',
  })
  return res.status(201).json(new ApiResponse(201, lesson, responseMessage.created('Lesson')))
})

/** Update lesson */
const updateLesson = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const data = req.body
  const lesson = await LessonModel.findByPk(id)
  if (!lesson) {
    return next(new ApiError(404, responseMessage.notFound('Lesson')))
  }
  await lesson.update(data)
  return res.status(200).json(new ApiResponse(200, lesson, responseMessage.updated('Lesson')))
})

/** Delete lesson */
const deleteLesson = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const lesson = await LessonModel.findByPk(id)
  if (!lesson) {
    return next(new ApiError(404, responseMessage.notFound('Lesson')))
  }
  await lesson.destroy()
  return res.status(200).json(new ApiResponse(200, null, responseMessage.deleted('Lesson')))
})

/** Reorder lessons */
const reorderLessons = asyncHandler(async (req, res, next) => {
  const { lessonIds } = req.body
  if (!lessonIds || !Array.isArray(lessonIds)) {
    return next(new ApiError(400, 'Lesson IDs are required'))
  }

  const transaction = await sequelize.transaction()
  try {
    for (let i = 0; i < lessonIds.length; i++) {
        await LessonModel.update(
          { lesson_order: i + 1 },
          { where: { id: lessonIds[i] }, transaction }
        )
    }
    await transaction.commit()
    return res.status(200).json(new ApiResponse(200, null, responseMessage.updated('Lesson order')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

export default {
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
}
