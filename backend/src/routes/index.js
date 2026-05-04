import express from 'express'
import { uploadMedia } from '../middlewares/multer.middleware.js'
import fileController from '../controllers/file.controller.js'
import authRouter from './authRouter.js'
import userRouter from './userRouter.js'
import courseRouter from './courseRouter.js'
import courseCategoryRouter from './courseCategoryRouter.js'
import galleryRouter from './galleryRouter.js'
import notificationRouter from './notificationRouter.js'
import otpRouter from './otpRouter.js'
import orderRouter from './orderRouter.js'
import requestRouter from './requestRouter.js'
import termsRouter from './termsAndConditionsRouter.js'
import userCourseRouter from './userCourseRouter.js'
import courseModuleRouter from './courseModuleRouter.js'
import lessonRouter from './lessonRouter.js'
import moduleTestRouter from './moduleTestRouter.js'
import testQuestionRouter from './testQuestionRouter.js'
import offlineBatchRouter from './offlineBatchRouter.js'
import lessonPageRouter from './lessonPageRouter.js'
import faqRouter from './faqRouter.js'
import aboutSectionRouter from './aboutSectionRouter.js'
import privacyPolicyRouter from './privacyPolicyRouter.js'
import courseRatingRouter from './courseRatingRouter.js'
import platformRatingRouter from './platformRatingRouter.js'
import lessonProgressRouter from './lessonProgressRouter.js'
import certificateRouter from './certificateRouter.js'

const router = express.Router()

// Common - Studio Uploads
router.get('/test', (req, res) => res.json({ status: 'ok', message: 'Router is alive' }));
router.post('/file', uploadMedia('file'), fileController.uploadFile)
router.post('/file/cleanup', (req, res, next) => {
  console.log("Cleanup request received:", req.body);
  fileController.cleanupFiles(req, res, next);
});

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/courses', courseRouter)
router.use('/courseCategory', courseCategoryRouter)
router.use('/gallery', galleryRouter)
router.use('/notifications', notificationRouter)
router.use('/otp', otpRouter)
router.use('/orders', orderRouter)
router.use('/requests', requestRouter)
router.use('/terms', termsRouter)
router.use('/userCourse', userCourseRouter)
router.use('/modules', courseModuleRouter)
router.use('/lessons', lessonRouter)
router.use('/module-tests', moduleTestRouter)
router.use('/test-questions', testQuestionRouter)
router.use('/batches', offlineBatchRouter)
router.use('/lesson-pages', lessonPageRouter)
router.use('/faqs', faqRouter)
router.use('/about-sections', aboutSectionRouter)
router.use('/privacy-policies', privacyPolicyRouter)
router.use('/course-ratings', courseRatingRouter)
router.use('/platform-ratings', platformRatingRouter)
router.use('/lesson-progress', lessonProgressRouter)
router.use('/certificates', certificateRouter)

export default router
