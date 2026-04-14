import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import sequelize from '../config/database.js'
import { CourseModuleModel, LessonModel, LessonPageModel, ModuleTestModel, TestQuestionModel, TestQuestionOptionModel } from '../models/associations.js'

/** Get modules by course ID */
const getModulesByCourseId = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params
  const modules = await CourseModuleModel.findAll({
    where: { course_id: courseId },
    include: [
      { 
        model: LessonModel, 
        as: 'lessons',
        include: [{
          model: LessonPageModel,
          as: 'pages'
        }]
      },
      { 
        model: ModuleTestModel, 
        as: 'test',
        include: [{ 
          model: TestQuestionModel, 
          as: 'questions',
          include: [{ model: TestQuestionOptionModel, as: 'options' }]
        }]
      },
    ],
    order: [
      ['module_order', 'ASC'], 
      [{ model: LessonModel, as: 'lessons' }, 'lesson_order', 'ASC'],
      [{ model: LessonModel, as: 'lessons' }, { model: LessonPageModel, as: 'pages' }, 'page_order', 'ASC'],
    ]
  })
  return res.status(200).json(new ApiResponse(200, modules, responseMessage.fetched('Modules')))
})

/** Create module */
const createModule = asyncHandler(async (req, res, next) => {
  const { course_id, title, description, module_order, status } = req.body
  if (!course_id || !title) {
    return next(new ApiError(400, 'Course ID and Title are required'))
  }
  const module = await CourseModuleModel.create({
    course_id,
    title,
    description,
    module_order: module_order || 0,
    status: status || 'draft',
  })
  return res.status(201).json(new ApiResponse(201, module, responseMessage.created('Module')))
})

/** Update module */
const updateModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const { title, description, module_order, status } = req.body
  const module = await CourseModuleModel.findByPk(id)
  if (!module) {
    return next(new ApiError(404, responseMessage.notFound('Module')))
  }
  await module.update({ title, description, module_order, status })
  return res.status(200).json(new ApiResponse(200, module, responseMessage.updated('Module')))
})

/** Delete module */
const deleteModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const module = await CourseModuleModel.findByPk(id)
  if (!module) {
    return next(new ApiError(404, responseMessage.notFound('Module')))
  }
  await module.destroy()
  return res.status(200).json(new ApiResponse(200, null, responseMessage.deleted('Module')))
})

/** Reorder modules */
const reorderModules = asyncHandler(async (req, res, next) => {
  const { moduleIds } = req.body
  if (!moduleIds || !Array.isArray(moduleIds)) {
    return next(new ApiError(400, 'Module IDs are required'))
  }

  const transaction = await sequelize.transaction()
  try {
    for (let i = 0; i < moduleIds.length; i++) {
      await CourseModuleModel.update(
        { module_order: i + 1 },
        { where: { id: moduleIds[i] }, transaction }
      )
    }
    await transaction.commit()
    return res.status(200).json(new ApiResponse(200, null, responseMessage.updated('Module order')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

export default {
  getModulesByCourseId,
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
}
