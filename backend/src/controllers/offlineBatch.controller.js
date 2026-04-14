import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { OfflineBatchModel } from '../models/associations.js'

/** Get batches by course ID */
const getBatchesByCourseId = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params
  const batches = await OfflineBatchModel.findAll({
    where: { course_id: courseId },
    order: [['start_date', 'ASC']]
  })
  return res.status(200).json(new ApiResponse(200, batches, responseMessage.fetched('Batches')))
})

const getBatchById = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const batch = await OfflineBatchModel.findByPk(id)
  if (!batch) return next(new ApiError(404, responseMessage.notFound('Batch')))
  return res.status(200).json(new ApiResponse(200, batch, responseMessage.fetched('Batch')))
})

/** Create batch */
const createBatch = asyncHandler(async (req, res, next) => {
  const { course_id, batch_name, start_date, end_date, class_days, start_time, end_time, location, seat_limit, status } = req.body
  if (!course_id || !batch_name) {
    return next(new ApiError(400, 'Course ID and Batch Name are required'))
  }
  const batch = await OfflineBatchModel.create({
    course_id,
    batch_name,
    start_date,
    end_date,
    class_days,
    start_time,
    end_time,
    location,
    seat_limit: seat_limit || 0,
    status: status || 'draft',
  })
  return res.status(201).json(new ApiResponse(201, batch, responseMessage.created('Batch')))
})

/** Update batch */
const updateBatch = asyncHandler(async (req, res, next) => {
  const { id } = req.body
  if (!id) return next(new ApiError(400, "Batch ID is required"))
  const data = req.body
  const batch = await OfflineBatchModel.findByPk(id)
  if (!batch) {
    return next(new ApiError(404, responseMessage.notFound('Batch')))
  }
  await batch.update(data)
  return res.status(200).json(new ApiResponse(200, batch, responseMessage.updated('Batch')))
})

/** Delete batch */
const deleteBatch = asyncHandler(async (req, res, next) => {
  const { id } = req.body
  if (!id) return next(new ApiError(400, "Batch ID is required"))
  const batch = await OfflineBatchModel.findByPk(id)
  if (!batch) {
    return next(new ApiError(404, responseMessage.notFound('Batch')))
  }
  await batch.destroy()
  return res.status(200).json(new ApiResponse(200, null, responseMessage.deleted('Batch')))
})

export default {
  getBatchesByCourseId,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
}
