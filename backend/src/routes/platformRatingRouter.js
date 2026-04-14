import express from 'express'
import platformRatingController from '../controllers/platformRating.controller.js'
import { authenticateUser } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/')
  .get(platformRatingController.getPlatformRatings)

router.route('/:id')
  .delete(authenticateUser, platformRatingController.deletePlatformRating)

export default router
