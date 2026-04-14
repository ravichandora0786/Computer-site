import { Op } from 'sequelize'
import { asyncHandler } from '../utils/asyncHandler.js'
import sequelize from '../config/database.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { UserModel, RoleModel } from '../models/associations.js'

/** Get all users */
const getUsers = asyncHandler(async (req, res, next) => {
  // Debug: Check which ID we are excluding
  const currentUserId = req.user?.id
  const { user_type } = req.query

  const where = {}

  if (currentUserId) {
    where.id = { [Op.ne]: currentUserId }
  }

  const include = [
    {
      model: RoleModel,
      as: 'role',
      attributes: ['id', 'name', 'type']
    }
  ]

  if (user_type) {
    where['$role.type$'] = user_type
  }

  const users = await UserModel.findAll({ where, include })
  return res
    .status(200)
    .json(new ApiResponse(200, users, responseMessage.fetched('Users')))
})

/** Get user by ID */
const getUserById = asyncHandler(async (req, res, next) => {
  const id = req.params.id || req.body.id
  const user = await UserModel.findByPk(id, {
    include: [{ model: RoleModel, as: 'role' }]
  })
  if (!user) {
    return next(new ApiError(404, responseMessage.notFound('User')))
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, responseMessage.fetched('User')))
})

/** Create user */
const createUser = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const user = await UserModel.create(req.body, { transaction })
    await transaction.commit()
    return res
      .status(201)
      .json(new ApiResponse(201, user, responseMessage.created('User')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Update user */
const updateUser = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const id = req.params.id || req.body.id
    if (!id) {
      await transaction.rollback()
      return next(new ApiError(400, "User ID is required"))
    }

    const user = await UserModel.findByPk(id, { transaction })
    if (!user) {
      await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('User')))
    }

    await user.update(req.body, { transaction })
    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, user, responseMessage.updated('User')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Delete user */
const deleteUser = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const id = req.params.id || req.body.id
    if (!id) {
      await transaction.rollback()
      return next(new ApiError(400, "User ID is required"))
    }

    const user = await UserModel.findByPk(id, { transaction })
    if (!user) {
      await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('User')))
    }

    await user.destroy({ transaction })
    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted('User')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Get user options for dropdowns (Filtered for Teachers) */
const getUserOptions = asyncHandler(async (req, res, next) => {
  const users = await UserModel.findAll({
    include: [{
      model: RoleModel,
      as: 'role',
      where: { type: 'teacher' },
      attributes: []
    }],
    attributes: ['id', 'user_name']
  })
  
  const options = users.map(user => ({
    label: user.user_name,
    value: user.id
  }))

  return res
    .status(200)
    .json(new ApiResponse(200, options, 'Teacher options fetched'))
})

/** Get mentors for public home page */
const getMentors = asyncHandler(async (req, res, next) => {
  const teachers = await UserModel.findAll({
    include: [{
      model: RoleModel,
      as: 'role',
      where: { type: 'teacher' },
      attributes: []
    }],
    attributes: ['id', 'user_name', 'profile_img', 'designation']
  })

  return res
    .status(200)
    .json(new ApiResponse(200, teachers, 'Mentors fetched successfully'))
})

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserOptions,
  getMentors,
}
