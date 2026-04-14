import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js'
import requestController from '../controllers/request.controller.js'

const requestRouter = express.Router()

requestRouter.use(authenticateUser)

requestRouter.get('/', requestController.getRequests)
requestRouter.post('/', requestController.createRequest)
requestRouter.put('/:id', requestController.updateRequest)

export default requestRouter
