import express from 'express'
import courseModuleController from '../controllers/courseModule.controller.js'

const router = express.Router()

router.get('/course/:courseId', courseModuleController.getModulesByCourseId)
router.post('/create', courseModuleController.createModule)
router.post('/update/:id', courseModuleController.updateModule)
router.delete('/delete/:id', courseModuleController.deleteModule)
router.patch('/reorder', courseModuleController.reorderModules)

export default router
