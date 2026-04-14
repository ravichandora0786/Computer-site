import express from 'express'
import aboutSectionController from '../controllers/aboutSection.controller.js'
import { authenticateUser } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/list', aboutSectionController.getAboutSections)
router.get('/getById/:id', aboutSectionController.getAboutSectionById)

// Protected routes
router.post('/create', authenticateUser, aboutSectionController.createAboutSection)
router.post('/update', authenticateUser, aboutSectionController.updateAboutSection)
router.post('/delete', authenticateUser, aboutSectionController.deleteAboutSection)
router.patch('/reorder', authenticateUser, aboutSectionController.reorderAboutSections)

export default router
