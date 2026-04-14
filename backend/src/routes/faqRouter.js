import express from 'express'
import faqController from '../controllers/faq.controller.js'
import { authenticateUser } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/list', faqController.getFAQs)
router.get('/getById/:id', faqController.getFAQById)

// Protected routes
router.post('/create', authenticateUser, faqController.createFAQ)
router.post('/update', authenticateUser, faqController.updateFAQ)
router.post('/delete', authenticateUser, faqController.deleteFAQ)
router.patch('/reorder', authenticateUser, faqController.reorderFAQs)

export default router
