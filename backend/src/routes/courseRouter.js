import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js'
import courseController from '../controllers/course.controller.js'

const courseRouter = express.Router()

courseRouter.get('/', courseController.getCourses)
courseRouter.get('/getById/:id', courseController.getCourseById)

// Protected routes
courseRouter.post('/create', authenticateUser, courseController.createCourse)
courseRouter.post('/update', authenticateUser, courseController.updateCourse)
courseRouter.patch('/status', authenticateUser, courseController.updateCourseStatus)
courseRouter.delete('/delete/:id', authenticateUser, courseController.deleteCourse)
courseRouter.post('/sync-media/:id', authenticateUser, courseController.syncCourseMedia)

export default courseRouter
