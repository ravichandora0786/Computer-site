import express from 'express'
import offlineBatchController from '../controllers/offlineBatch.controller.js'
import { authenticateUser } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authenticateUser)

router.get('/list', (req, res) => res.status(200).json({ message: "Use /course/:courseId to fetch batches" }))
router.get('/course/:courseId', offlineBatchController.getBatchesByCourseId)
router.get('/getById/:id', offlineBatchController.getBatchById)
router.post('/create', offlineBatchController.createBatch)
router.post('/update', offlineBatchController.updateBatch)
router.post('/delete', offlineBatchController.deleteBatch)

export default router
