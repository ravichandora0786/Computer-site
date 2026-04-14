import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js'
import termsController from '../controllers/termsAndConditions.controller.js'

const termsRouter = express.Router()

termsRouter.get('/list', termsController.getTerms)
termsRouter.get('/getById/:id', termsController.getTermById)

// Protected routes
termsRouter.post('/create', authenticateUser, termsController.createTerm)
termsRouter.post('/update', authenticateUser, termsController.updateTerm)
termsRouter.post('/delete', authenticateUser, termsController.deleteTerm)
termsRouter.patch('/reorder', authenticateUser, termsController.reorderTerms)

export default termsRouter
