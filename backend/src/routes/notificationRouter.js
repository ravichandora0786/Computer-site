import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js'
import notificationController from '../controllers/notification.controller.js'

const notificationRouter = express.Router()

notificationRouter.use(authenticateUser)

notificationRouter.get('/', notificationController.getNotifications)
notificationRouter.post('/', notificationController.createNotification)
notificationRouter.put('/:id/read', notificationController.markAsRead)

export default notificationRouter
