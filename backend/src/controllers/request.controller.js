import { asyncHandler } from '../utils/asyncHandler.js'
import sequelize from '../config/database.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { RequestModel, UserModel } from '../models/associations.js'

/** Get all requests */
const getRequests = asyncHandler(async (req, res, next) => {
  const requests = await RequestModel.findAll({
    include: [
      { model: UserModel, as: 'user' },
      { model: UserModel, as: 'handler' },
    ],
  })
  return res
    .status(200)
    .json(new ApiResponse(200, requests, responseMessage.fetched('Requests')))
})

/** Create request */
const createRequest = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const request = await RequestModel.create(req.body, { transaction })
    await transaction.commit()
    return res
      .status(201)
      .json(new ApiResponse(201, request, responseMessage.created('Request')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Update request status */
const updateRequest = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const request = await RequestModel.findByPk(req.params.id, { transaction })
    if (!request) {
      await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('Request')))
    }
    await request.update(req.body, { transaction })
    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, request, responseMessage.updated('Request')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

export default {
  getRequests,
  createRequest,
  updateRequest,
}
