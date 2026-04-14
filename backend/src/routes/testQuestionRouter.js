import express from 'express'
import testQuestionController from '../controllers/testQuestion.controller.js'

const router = express.Router()

router.get('/test/:testId', testQuestionController.getQuestionsByTestId)
router.post('/create', testQuestionController.createQuestion)
router.post('/update/:id', testQuestionController.updateQuestion)
router.delete('/delete/:id', testQuestionController.deleteQuestion)
router.patch('/reorder', testQuestionController.reorderQuestions)

export default router
