import express from 'express'
import lessonController from '../controllers/lesson.controller.js'

const router = express.Router()

router.post('/create', lessonController.createLesson)
router.post('/update/:id', lessonController.updateLesson)
router.delete('/delete/:id', lessonController.deleteLesson)
router.patch('/reorder', lessonController.reorderLessons)

export default router
