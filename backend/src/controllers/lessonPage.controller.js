import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import sequelize from '../config/database.js'
import { LessonPageModel, LessonModel } from '../models/associations.js'
import { commitMedia, cleanupOrphanedMedia } from '../utils/mediaCommit.js'

/** Helper to update Lesson total duration based on its pages */
const updateLessonDuration = async (lesson_id) => {
  const pages = await LessonPageModel.findAll({
    where: { lesson_id },
    attributes: ['required_time']
  })
  const totalDuration = pages.reduce((sum, page) => sum + (page.required_time || 0), 0)
  await LessonModel.update({ duration_min: totalDuration }, { where: { id: lesson_id } })
}

/** Create Lesson Page */
const createPage = asyncHandler(async (req, res, next) => {
  const { lesson_id, title, html_content, page_order, is_preview, status, required_time } = req.body
  if (!lesson_id || !title) {
    return next(new ApiError(400, 'Lesson ID and Title are required'))
  }

  // Commit any temp media to permanent storage
  const committedHtml = commitMedia(html_content, 'lesson_content');

  const page = await LessonPageModel.create({
    lesson_id,
    title,
    html_content: committedHtml,
    page_order: page_order || 1,
    is_preview: is_preview || false,
    required_time: required_time || 0,
    status: status || 'draft',
  })

  // Update parent lesson duration
  await updateLessonDuration(lesson_id)

  return res.status(201).json(new ApiResponse(201, page, responseMessage.created('Lesson page')))
})

/** Update Lesson Page */
const updatePage = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const { html_content, ...rest } = req.body
  
  const page = await LessonPageModel.findByPk(id)
  if (!page) {
    return next(new ApiError(404, responseMessage.notFound('Lesson page')))
  }

  // Capture OLD content to cleanup outdated media later
  const oldHtml = page.html_content;

  // Commit any NEW temp media to permanent storage
  let finalHtml = html_content;
  if (html_content) {
    finalHtml = commitMedia(html_content, 'lesson_content');
  }

  // Perform cleanup of OLD media that is now removed
  if (oldHtml && finalHtml) {
    cleanupOrphanedMedia(oldHtml, finalHtml, 'lesson_content');
  }

  await page.update({ ...rest, html_content: finalHtml })

  // Update parent lesson duration
  await updateLessonDuration(page.lesson_id)

  return res.status(200).json(new ApiResponse(200, page, responseMessage.updated('Lesson page')))
})

/** Delete Lesson Page */
const deletePage = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const page = await LessonPageModel.findByPk(id)
  if (!page) {
    return next(new ApiError(404, responseMessage.notFound('Lesson page')))
  }
  const lessonId = page.lesson_id
  await page.destroy()

  // Update parent lesson duration
  await updateLessonDuration(lessonId)

  return res.status(200).json(new ApiResponse(200, null, responseMessage.deleted('Lesson page')))
})

/** Reorder Pages */
const reorderPages = asyncHandler(async (req, res, next) => {
  const { pageIds } = req.body
  if (!pageIds || !Array.isArray(pageIds)) {
    return next(new ApiError(400, 'Page IDs are required'))
  }
  const transaction = await sequelize.transaction()
  try {
    for (let i = 0; i < pageIds.length; i++) {
      await LessonPageModel.update({ page_order: i + 1 }, { where: { id: pageIds[i] }, transaction })
    }
    await transaction.commit()
    return res.status(200).json(new ApiResponse(200, null, responseMessage.updated('Page order')))
  } catch (err) {
    if (transaction) await transaction.rollback()
    return next(err)
  }
})

export default {
  createPage,
  updatePage,
  deletePage,
  reorderPages
}
