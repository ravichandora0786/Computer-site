import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { 
  LessonProgressModel, 
  UserCourseModel, 
  LessonModel, 
  CourseModuleModel,
  UserPageProgressModel,
  LessonPageModel
} from '../models/associations.js'

/** Internal helper to sync overall course progress */
const syncCourseProgress = async (userId, courseId) => {
  const modules = await CourseModuleModel.findAll({
    where: { course_id: courseId },
    attributes: ['id']
  })
  const moduleIds = modules.map(m => m.id)

  const courseLessons = await LessonModel.findAll({
    where: { module_id: moduleIds },
    attributes: ['id']
  })

  const totalLessons = courseLessons.length
  if (totalLessons === 0) return 0

  const lessonIds = courseLessons.map(l => l.id)
  const userProgressRecords = await LessonProgressModel.findAll({
    where: {
      lesson_id: lessonIds,
      student_id: userId
    },
    attributes: ['progress']
  })

  const totalProgressSum = userProgressRecords.reduce((sum, record) => sum + record.progress, 0)
  const overallProgress = Math.round(totalProgressSum / totalLessons)

  await UserCourseModel.update(
    { progress: overallProgress },
    { where: { courseId: courseId, userId: userId } }
  )

  return overallProgress
}

/** Update lesson progress and sync with overall course progress */
export const updateLessonProgress = asyncHandler(async (req, res) => {
  const { lessonId, progress, moduleId, courseId } = req.body
  const userId = req.user.id

  if (!lessonId || progress === undefined || !courseId) {
    throw new ApiError(400, "Lesson ID, Course ID, and Progress are required")
  }

  let lessonProgress = await LessonProgressModel.findOne({
    where: { lesson_id: lessonId, student_id: userId }
  })

  if (lessonProgress) {
    if (progress > lessonProgress.progress) {
      await lessonProgress.update({
        progress: progress,
        is_completed: progress >= 90,
        completed_at: progress >= 90 ? new Date() : lessonProgress.completed_at
      })
    }
  } else {
    let targetModuleId = moduleId;
    if (!targetModuleId) {
        const lesson = await LessonModel.findByPk(lessonId);
        targetModuleId = lesson?.module_id;
    }

    lessonProgress = await LessonProgressModel.create({
      lesson_id: lessonId,
      student_id: userId,
      module_id: targetModuleId,
      course_id: courseId,
      progress: progress,
      is_completed: progress >= 90,
      completed_at: progress >= 90 ? new Date() : null
    })
  }

  const overallProgress = await syncCourseProgress(userId, courseId)

  return res.status(200).json(
    new ApiResponse(200, { lessonProgress, overallProgress }, "Progress updated successfully")
  )
})

/** Update individual page time/progress (Heartbeat/Pulse) */
export const updatePageProgress = asyncHandler(async (req, res) => {
  const { pageId, lessonId, courseId, secondsIncrement } = req.body
  const userId = req.user.id

  if (!pageId || !lessonId || !courseId) {
    throw new ApiError(400, "Page ID, Lesson ID, and Course ID are required")
  }

  // 1. Get Page Requirements
  const page = await LessonPageModel.findByPk(pageId)
  if (!page) throw new ApiError(404, "Page not found")

  const requiredSeconds = (page.required_time || 0) * 60

  // 2. Update Page Progress
  let pageProgress = await UserPageProgressModel.findOne({
    where: { user_id: userId, page_id: pageId }
  })

  if (!pageProgress) {
    pageProgress = await UserPageProgressModel.create({
      user_id: userId,
      page_id: pageId,
      lesson_id: lessonId,
      course_id: courseId,
      time_spent: secondsIncrement || 0,
      is_completed: (secondsIncrement || 0) >= requiredSeconds && requiredSeconds > 0
    })
  } else {
    const newTime = pageProgress.time_spent + (secondsIncrement || 0)
    const isNowCompleted = newTime >= requiredSeconds && requiredSeconds > 0
    
    await pageProgress.update({
      time_spent: newTime,
      is_completed: pageProgress.is_completed || isNowCompleted,
      completed_at: (isNowCompleted && !pageProgress.is_completed) ? new Date() : pageProgress.completed_at
    })
  }

  // 3. Recalculate Lesson Progress
  const totalPagesInLesson = await LessonPageModel.count({ where: { lesson_id: lessonId } })
  const masteredPagesCount = await UserPageProgressModel.count({ 
    where: { user_id: userId, lesson_id: lessonId, is_completed: true } 
  })

  const lessonPercentage = totalPagesInLesson > 0 
    ? Math.round((masteredPagesCount / totalPagesInLesson) * 100) 
    : 0

  let lessonProgress = await LessonProgressModel.findOne({
    where: { lesson_id: lessonId, student_id: userId }
  })

  if (lessonProgress) {
    await lessonProgress.update({
      progress: lessonPercentage,
      is_completed: lessonPercentage >= 90,
      completed_at: lessonPercentage >= 90 ? new Date() : lessonProgress.completed_at
    })
  } else {
    lessonProgress = await LessonProgressModel.create({
      lesson_id: lessonId,
      student_id: userId,
      course_id: courseId,
      progress: lessonPercentage,
      is_completed: lessonPercentage >= 90,
      completed_at: lessonPercentage >= 90 ? new Date() : null
    })
  }

  // 4. Final Sync for Course
  const overallProgress = await syncCourseProgress(userId, courseId)

  return res.status(200).json(
    new ApiResponse(200, { 
      pageProgress, 
      lessonProgress, 
      overallProgress 
    }, "Page time tracked successfully")
  )
})

export default {
  updateLessonProgress,
  updatePageProgress
}
