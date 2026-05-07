import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js'
import userCourseController from '../controllers/userCourse.controller.js'

const userCourseRouter = express.Router()

userCourseRouter.use(authenticateUser)

userCourseRouter.get('/list', userCourseController.getUserCourses)
userCourseRouter.get('/stats', userCourseController.getEnrollmentStats)
userCourseRouter.post('/create', userCourseController.enrollCourse)
userCourseRouter.put('/update', userCourseController.updateEnrollmentStatus)
userCourseRouter.delete('/unenroll', userCourseController.unenrollCourse)

export default userCourseRouter
