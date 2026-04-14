import { asyncHandler } from '../utils/asyncHandler.js'
import sequelize from '../config/database.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { NotificationModel } from '../models/associations.js'

/** Get all notifications for a user */
const getNotifications = asyncHandler(async (req, res, next) => {
  const where = {}
  if (req.query.userId) where.userId = req.query.userId
  
  const notifications = await NotificationModel.findAll({ where })
  return res
    .status(200)
    .json(new ApiResponse(200, notifications, responseMessage.fetched('Notifications')))
})

/** Create notification */
const createNotification = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const notification = await NotificationModel.create(req.body, { transaction })
    await transaction.commit()
    return res
      .status(201)
      .json(new ApiResponse(201, notification, responseMessage.created('Notification')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Mark notification as read */
const markAsRead = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const notification = await NotificationModel.findByPk(req.params.id, { transaction })
    if (!notification) {
      await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('Notification')))
    }
    await notification.update({ readStatus: true }, { transaction })
    await transaction.commit()
    return res
      .status(200)
      .json(new ApiResponse(200, notification, responseMessage.statusUpdated('Notification')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

export default {
  getNotifications,
  createNotification,
  markAsRead,
}
