import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js'
import courseCategoryController from '../controllers/courseCategory.controller.js'

const courseCategoryRouter = express.Router()

courseCategoryRouter.get('/list', courseCategoryController.getCourseCategories)
courseCategoryRouter.get('/getById/:id', courseCategoryController.getCourseCategoryById)
courseCategoryRouter.get('/options', courseCategoryController.getCourseCategoryOptions)

// Protected routes
courseCategoryRouter.patch('/reorder', authenticateUser, courseCategoryController.reorderCourseCategories)
courseCategoryRouter.post('/create', authenticateUser, courseCategoryController.createCourseCategory)
courseCategoryRouter.post('/update', authenticateUser, courseCategoryController.updateCourseCategory)
courseCategoryRouter.post('/delete', authenticateUser, courseCategoryController.deleteCourseCategory)

export default courseCategoryRouter
