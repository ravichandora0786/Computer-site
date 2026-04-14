import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js'
import orderController from '../controllers/order.controller.js'

const orderRouter = express.Router()

orderRouter.use(authenticateUser)

orderRouter.get('/', orderController.getOrders)
orderRouter.post('/', orderController.createOrder)
orderRouter.put('/:id/status', orderController.updateOrderStatus)

export default orderRouter
