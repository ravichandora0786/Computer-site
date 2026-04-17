import { Router } from 'express'
import lessonProgressController from '../controllers/lessonProgress.controller.js'
import { authenticateUser } from '../middlewares/authMiddleware.js'

const router = Router()

// All progress routes require authentication
router.use(authenticateUser)

router.post('/update', lessonProgressController.updateLessonProgress)
router.post('/update-page-progress', lessonProgressController.updatePageProgress)

export default router
