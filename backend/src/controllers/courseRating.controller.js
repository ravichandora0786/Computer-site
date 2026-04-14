import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { CourseRatingModel, UserModel, CourseModel } from '../models/associations.js'

const getCourseRatings = asyncHandler(async (req, res) => {
  const ratings = await CourseRatingModel.findAll({
    include: [
      { model: UserModel, as: 'user', attributes: ['id', 'user_name', 'email'] },
      { model: CourseModel, as: 'course', attributes: ['id', 'title'] }
    ],
    order: [['createdAt', 'DESC']]
  })
  return res.status(200).json(new ApiResponse(200, ratings, responseMessage.fetched('Course Ratings')))
})

const deleteRating = asyncHandler(async (req, res, next) => {
  const rating = await CourseRatingModel.findByPk(req.params.id)
  if (!rating) return next(new ApiError(404, responseMessage.notFound('Rating')))
  await rating.destroy()
  return res.status(200).json(new ApiResponse(200, null, responseMessage.deleted('Rating')))
})

export default { getCourseRatings, deleteRating }
