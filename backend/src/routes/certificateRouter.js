import express from 'express'
import certificateController from '../controllers/certificate.controller.js'
import { authenticateUser } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authenticateUser)

router.get('/user-list', certificateController.getUserCertificates)
router.get('/all', certificateController.getAllCertificates) // Admin Only
router.post('/apply', certificateController.applyForCertificate)
router.post('/approve/:id', certificateController.approveCertificate) // Admin Only
router.post('/generate', certificateController.generateCertificate) // Admin Only

export default router
