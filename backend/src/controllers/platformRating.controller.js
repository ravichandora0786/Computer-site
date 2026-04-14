import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { PlatformRatingModel, UserModel } from '../models/associations.js'

const getPlatformRatings = asyncHandler(async (req, res) => {
  const ratings = await PlatformRatingModel.findAll({
    include: [
      { model: UserModel, as: 'user', attributes: ['id', 'user_name', 'email'] }
    ],
    order: [['createdAt', 'DESC']]
  })
  return res.status(200).json(new ApiResponse(200, ratings, responseMessage.fetched('Platform Ratings')))
})

const deletePlatformRating = asyncHandler(async (req, res, next) => {
  const rating = await PlatformRatingModel.findByPk(req.params.id)
  if (!rating) return next(new ApiError(404, responseMessage.notFound('Rating')))
  await rating.destroy()
  return res.status(200).json(new ApiResponse(200, null, responseMessage.deleted('Rating')))
})

export default { getPlatformRatings, deletePlatformRating }
