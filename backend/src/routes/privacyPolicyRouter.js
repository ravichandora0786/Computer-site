import express from 'express'
import privacyPolicyController from '../controllers/privacyPolicy.controller.js'
import { authenticateUser } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/list', privacyPolicyController.getPolicies)
router.get('/getById/:id', privacyPolicyController.getPolicyById)

// Protected routes
router.post('/create', authenticateUser, privacyPolicyController.createPolicy)
router.post('/update', authenticateUser, privacyPolicyController.updatePolicy)
router.post('/delete', authenticateUser, privacyPolicyController.deletePolicy)
router.patch('/reorder', authenticateUser, privacyPolicyController.reorderPolicies)

export default router
