import { asyncHandler } from '../utils/asyncHandler.js'
import sequelize from '../config/database.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { TermsAndConditionsModel } from '../models/associations.js'

/** Get all terms with pagination */
const getTerms = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const offset = (page - 1) * limit
  const where = req.query.all === 'true' ? {} : { is_active: true }

  const { count, rows: terms } = await TermsAndConditionsModel.findAndCountAll({
    where,
    limit,
    offset,
    order: [
      [sequelize.literal('CASE WHEN sort_order = 0 THEN 1 ELSE 0 END'), 'ASC'],
      ['sort_order', 'ASC'],
      ['createdAt', 'DESC'],
    ],
  })

  const totalPages = Math.ceil(count / limit)

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        items: terms,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      responseMessage.fetched('Terms')
    )
  )
})

/** Get term by ID */
const getTermById = asyncHandler(async (req, res, next) => {
  const term = await TermsAndConditionsModel.findByPk(req.params.id)
  if (!term) {
    return next(new ApiError(404, responseMessage.notFound('Term')))
  }
  return res
    .status(200)
    .json(new ApiResponse(200, term, responseMessage.fetched('Term')))
})

/** Create term */
const createTerm = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const term = await TermsAndConditionsModel.create(req.body, { transaction })
    await transaction.commit()
    return res
      .status(201)
      .json(new ApiResponse(201, term, responseMessage.created('Term')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Update term */
const updateTerm = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const term = await TermsAndConditionsModel.findByPk(req.params.id, { transaction })
    if (!term) {
      await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('Term')))
    }
    await term.update(req.body, { transaction })
    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, term, responseMessage.updated('Term')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Delete term */
const deleteTerm = asyncHandler(async (req, res, next) => {
  const term = await TermsAndConditionsModel.findByPk(req.params.id)
  if (!term) {
    return next(new ApiError(404, responseMessage.notFound('Term')))
  }
  await term.destroy()
  return res
    .status(200)
    .json(new ApiResponse(200, null, responseMessage.deleted('Term')))
})

/** Reorder terms */
const reorderTerms = asyncHandler(async (req, res, next) => {
  const { categoryIds } = req.body 
  if (!categoryIds || !Array.isArray(categoryIds)) {
    return next(new ApiError(400, "IDs array is required"))
  }

  const transaction = await sequelize.transaction()
  try {
    const updatePromises = categoryIds.map((id, index) => {
      return TermsAndConditionsModel.update(
        { sort_order: index + 1 },
        { where: { id }, transaction }
      )
    })

    await Promise.all(updatePromises)
    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.updated('Terms order')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

export default {
  getTerms,
  getTermById,
  createTerm,
  updateTerm,
  deleteTerm,
  reorderTerms,
}
