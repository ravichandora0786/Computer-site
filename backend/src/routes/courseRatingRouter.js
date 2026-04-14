import express from 'express'
import courseRatingController from '../controllers/courseRating.controller.js'
import { authenticateUser } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/')
  .get(courseRatingController.getCourseRatings)

router.route('/:id')
  .delete(authenticateUser, courseRatingController.deleteRating)

export default router
