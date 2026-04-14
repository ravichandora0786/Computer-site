import express from 'express'
import lessonPageController from '../controllers/lessonPage.controller.js'

const router = express.Router()

// Pages
router.post('/create', lessonPageController.createPage)
router.post('/update/:id', lessonPageController.updatePage)
router.delete('/delete/:id', lessonPageController.deletePage)
router.patch('/reorder', lessonPageController.reorderPages)

export default router
