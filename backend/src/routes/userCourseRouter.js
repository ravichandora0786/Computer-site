import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js'
import userCourseController from '../controllers/userCourse.controller.js'

const userCourseRouter = express.Router()

userCourseRouter.use(authenticateUser)

userCourseRouter.get('/', userCourseController.getUserCourses)
userCourseRouter.post('/enroll', userCourseController.enrollCourse)
userCourseRouter.put('/:id/status', userCourseController.updateEnrollmentStatus)

export default userCourseRouter
