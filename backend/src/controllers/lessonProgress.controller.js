import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import {
  LessonProgressModel,
  UserCourseModel,
  LessonModel,
  CourseModuleModel,
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
  const userId = req.user?.id

  console.log('UpdatePageProgress called:', { pageId, lessonId, courseId, secondsIncrement, userId });

  if (!pageId || !lessonId || !courseId) {
    throw new ApiError(400, "Page ID, Lesson ID, and Course ID are required")
  }

  // 1. Get Page Requirements
  const page = await LessonPageModel.findByPk(pageId)
  if (!page) {
    console.error('Page not found:', pageId);
    throw new ApiError(404, "Page not found")
  }

  const requiredSeconds = (page.required_time || 0)

  // 2. Fetch or Create Lesson Progress (The central record)
  let lessonProgress = await LessonProgressModel.findOne({
    where: { lesson_id: lessonId, student_id: userId }
  })

  if (!lessonProgress) {
    console.log('LessonProgress not found, creating new one...');
    // Get module_id from Lesson model first
    const lessonData = await LessonModel.findByPk(lessonId);
    const moduleId = lessonData?.module_id;
    
    if (!moduleId) {
        console.error('Module ID not found for lesson:', lessonId);
    }

    try {
        lessonProgress = await LessonProgressModel.create({
            lesson_id: lessonId,
            student_id: userId,
            course_id: courseId,
            module_id: moduleId,
            pages_data: {},
            progress: 0
        })
        console.log('New LessonProgress created with ID:', lessonProgress.id);
    } catch (createError) {
        console.error('FAILED TO CREATE LESSON PROGRESS:', createError);
        throw createError;
    }
  }

  // 3. Update the JSON pages_data
  const pagesData = { ...(lessonProgress.pages_data || {}) };
  console.log('Current pages_data:', pagesData);
  const currentPageData = pagesData[pageId] || { time_spent: 0, is_completed: false };

  const newTime = currentPageData.time_spent + (secondsIncrement || 0)
  const isNowCompleted = newTime >= requiredSeconds;

  pagesData[pageId] = {
    time_spent: newTime,
    is_completed: currentPageData.is_completed || isNowCompleted,
    completed_at: (isNowCompleted && !currentPageData.is_completed) ? new Date() : currentPageData.completed_at
  };

  // 4. Calculate Lesson Percentage from JSON
  const totalPagesInLesson = await LessonPageModel.count({ where: { lesson_id: lessonId } })
  const masteredPagesCount = Object.values(pagesData).filter(p => p.is_completed).length;

  const lessonPercentage = totalPagesInLesson > 0
    ? Math.round((masteredPagesCount / totalPagesInLesson) * 100)
    : 0

  // 5. Save Lesson Progress
  await lessonProgress.update({
    pages_data: pagesData,
    progress: lessonPercentage,
    is_completed: lessonPercentage >= 90,
    completed_at: lessonPercentage >= 90 ? (lessonProgress.completed_at || new Date()) : lessonProgress.completed_at
  });

  // 6. Final Sync for Overall Course
  const overallProgress = await syncCourseProgress(userId, courseId)

  return res.status(200).json(
    new ApiResponse(200, {
      pageProgress: pagesData[pageId], // Return the current page data for compatibility
      lessonProgress,
      overallProgress
    }, "Page time tracked successfully in JSON")
  )
})

export default {
  updateLessonProgress,
  updatePageProgress
}
