import express from 'express'
import moduleTestController from '../controllers/moduleTest.controller.js'

const router = express.Router()

router.get('/module/:moduleId', moduleTestController.getTestByModuleId)
router.post('/create', moduleTestController.createTest)
router.post('/update/:id', moduleTestController.updateTest)
router.delete('/delete/:id', moduleTestController.deleteTest)

export default router
