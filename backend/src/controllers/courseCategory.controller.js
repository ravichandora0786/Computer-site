import { asyncHandler } from '../utils/asyncHandler.js'
import sequelize from '../config/database.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { CourseCategoryModel } from '../models/associations.js'

/** Get all course categories with pagination */
const getCourseCategories = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const offset = (page - 1) * limit

  const { count, rows: categories } = await CourseCategoryModel.findAndCountAll({
    limit,
    offset,
    order: [
      [sequelize.literal('CASE WHEN sort_order = 0 THEN 1 ELSE 0 END'), 'ASC'],
      ['sort_order', 'ASC'],
      ['title', 'ASC']
    ]
  })

  const totalPages = Math.ceil(count / limit)

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        items: categories,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      responseMessage.fetched('Course Categories')
    )
  )
})

/** Get course category by ID */
const getCourseCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const category = await CourseCategoryModel.findByPk(id)
  if (!category) {
    return next(new ApiError(404, responseMessage.notFound('Course Category')))
  }
  return res
    .status(200)
    .json(new ApiResponse(200, category, responseMessage.fetched('Course Category')))
})

/** Create course category */
const createCourseCategory = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const category = await CourseCategoryModel.create(req.body, { transaction })
    await transaction.commit()
    return res
      .status(201)
      .json(new ApiResponse(201, category, responseMessage.created('Course Category')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Update course category */
const updateCourseCategory = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const { id } = req.body
    if (!id) {
      await transaction.rollback()
      return next(new ApiError(400, "Category ID is required"))
    }
    
    const category = await CourseCategoryModel.findByPk(id, { transaction })
    if (!category) {
      await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('Course Category')))
    }
    
    await category.update(req.body, { transaction })
    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, category, responseMessage.updated('Course Category')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Delete course category */
const deleteCourseCategory = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const { id } = req.body
    if (!id) {
      await transaction.rollback()
      return next(new ApiError(400, "Category ID is required"))
    }

    const category = await CourseCategoryModel.findByPk(id, { transaction })
    if (!category) {
      await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('Course Category')))
    }
    
    await category.destroy({ transaction })
    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted('Course Category')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Get course category options for dropdowns */
const getCourseCategoryOptions = asyncHandler(async (req, res, next) => {
  const categories = await CourseCategoryModel.findAll({
    where: { is_active: true },
    attributes: ['id', 'title'],
    order: [
      [sequelize.literal('CASE WHEN sort_order = 0 THEN 1 ELSE 0 END'), 'ASC'],
      ['sort_order', 'ASC'],
      ['title', 'ASC']
    ]
  })
  
  const options = categories.map(cat => ({
    label: cat.title,
    value: cat.id
  }))

  return res
    .status(200)
    .json(new ApiResponse(200, options, 'Category options fetched'))
})

/** Bulk reorder categories */
const reorderCourseCategories = asyncHandler(async (req, res, next) => {
  const { ids } = req.body // Array of IDs in new order
  if (!ids || !Array.isArray(ids)) {
    return next(new ApiError(400, "IDs array is required"))
  }

  const transaction = await sequelize.transaction()
  try {
    // Perform bulk update of sort_order based on array index (1-based)
    const updatePromises = ids.map((id, index) => {
      return CourseCategoryModel.update(
        { sort_order: index + 1 },
        { where: { id }, transaction }
      )
    })

    await Promise.all(updatePromises)
    await transaction.commit()

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Categories reordered successfully'))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

export default {
  getCourseCategories,
  getCourseCategoryById,
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
  getCourseCategoryOptions,
  reorderCourseCategories,
}
