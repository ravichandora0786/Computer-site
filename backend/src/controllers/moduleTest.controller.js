import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { ModuleTestModel, TestQuestionModel, TestQuestionOptionModel } from '../models/associations.js'

/** Get test by module ID */
const getTestByModuleId = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params
  const test = await ModuleTestModel.findOne({
    where: { module_id: moduleId },
    include: [
      {
        model: TestQuestionModel,
        as: 'questions',
        include: [{ model: TestQuestionOptionModel, as: 'options' }]
      }
    ]
  })
  if (!test) {
    return next(new ApiError(404, responseMessage.notFound('Test')))
  }
  return res.status(200).json(new ApiResponse(200, test, responseMessage.fetched('Test')))
})

/** Create test */
const createTest = asyncHandler(async (req, res, next) => {
  const { module_id, title, description, passing_percentage, total_marks, duration_min, max_attempts, status } = req.body
  if (!module_id || !title) {
    return next(new ApiError(400, 'Module ID and Title are required'))
  }
  const test = await ModuleTestModel.create({
    module_id,
    title,
    description,
    passing_percentage: passing_percentage || 40,
    total_marks: total_marks || 0,
    duration_min: duration_min || 0,
    max_attempts: max_attempts || 3,
    status: status || 'draft',
  })
  return res.status(201).json(new ApiResponse(201, test, responseMessage.created('Test')))
})

/** Update test */
const updateTest = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const data = req.body
  const test = await ModuleTestModel.findByPk(id)
  if (!test) {
    return next(new ApiError(404, responseMessage.notFound('Test')))
  }
  await test.update(data)
  return res.status(200).json(new ApiResponse(200, test, responseMessage.updated('Test')))
})

/** Delete test */
const deleteTest = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const test = await ModuleTestModel.findByPk(id)
  if (!test) {
    return next(new ApiError(404, responseMessage.notFound('Test')))
  }
  await test.destroy()
  return res.status(200).json(new ApiResponse(200, null, responseMessage.deleted('Test')))
})

export default {
  getTestByModuleId,
  createTest,
  updateTest,
  deleteTest,
}
