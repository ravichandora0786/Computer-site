import { asyncHandler } from '../utils/asyncHandler.js'
import sequelize from '../config/database.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { OrderModel, CourseModel, UserModel } from '../models/associations.js'

/** Get all orders */
const getOrders = asyncHandler(async (req, res, next) => {
  const orders = await OrderModel.findAll({
    include: [
      { model: CourseModel, as: 'course' },
      { model: UserModel, as: 'user' },
    ],
  })
  return res
    .status(200)
    .json(new ApiResponse(200, orders, responseMessage.fetched('Orders')))
})

/** Create order */
const createOrder = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const order = await OrderModel.create(req.body, { transaction })
    await transaction.commit()
    return res
      .status(201)
      .json(new ApiResponse(201, order, responseMessage.created('Order')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Update order status */
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const order = await OrderModel.findByPk(req.params.id, { transaction })
    if (!order) {
      await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('Order')))
    }
    await order.update({ status: req.body.status }, { transaction })
    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, order, responseMessage.statusUpdated('Order')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

export default {
  getOrders,
  createOrder,
  updateOrderStatus,
}
