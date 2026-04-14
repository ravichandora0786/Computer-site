import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import sequelize from '../config/database.js'
import { TestQuestionModel, TestQuestionOptionModel } from '../models/associations.js'

/** Get questions by test ID */
const getQuestionsByTestId = asyncHandler(async (req, res, next) => {
  const { testId } = req.params
  const questions = await TestQuestionModel.findAll({
    where: { test_id: testId },
    include: [{ model: TestQuestionOptionModel, as: 'options' }],
    order: [
      [sequelize.literal('question_order = 0'), 'ASC'],
      ['question_order', 'ASC']
    ]
  })
  return res.status(200).json(new ApiResponse(200, questions, responseMessage.fetched('Questions')))
})

/** Create question with options */
const createQuestion = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const { test_id, question, question_type, marks, question_order, randomize_options, options } = req.body
    if (!test_id || !question) {
      await transaction.rollback()
      return next(new ApiError(400, 'Test ID and Question text are required'))
    }

    const newQuestion = await TestQuestionModel.create({
      test_id,
      question,
      question_type: question_type || 'single_choice',
      marks: marks || 1,
      question_order: question_order || 0,
      randomize_options: randomize_options || false,
    }, { transaction })

    if (options && Array.isArray(options)) {
      const optionsToCreate = options.map((opt, idx) => ({
        ...opt,
        question_id: newQuestion.id,
        option_order: idx
      }))
      await TestQuestionOptionModel.bulkCreate(optionsToCreate, { transaction })
    }

    await transaction.commit()
    const result = await TestQuestionModel.findByPk(newQuestion.id, {
      include: [{ model: TestQuestionOptionModel, as: 'options' }]
    })

    return res.status(201).json(new ApiResponse(201, result, responseMessage.created('Question')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Update question and options */
const updateQuestion = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const { id } = req.params
    const { question, question_type, marks, question_order, randomize_options, options } = req.body
    const existingQuestion = await TestQuestionModel.findByPk(id)
    if (!existingQuestion) {
      await transaction.rollback()
      return next(new ApiError(404, responseMessage.notFound('Question')))
    }

    await existingQuestion.update({ question, question_type, marks, question_order, randomize_options }, { transaction })

    if (options && Array.isArray(options)) {
      // Delete existing options
      await TestQuestionOptionModel.destroy({ where: { question_id: id }, transaction })
      // Re-create new options
      const optionsToCreate = options.map((opt, idx) => ({
        ...opt,
        question_id: id,
        option_order: idx
      }))
      await TestQuestionOptionModel.bulkCreate(optionsToCreate, { transaction })
    }

    await transaction.commit()
    const result = await TestQuestionModel.findByPk(id, {
      include: [{ model: TestQuestionOptionModel, as: 'options' }]
    })

    return res.status(200).json(new ApiResponse(200, result, responseMessage.updated('Question')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Delete question */
const deleteQuestion = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const question = await TestQuestionModel.findByPk(id)
  if (!question) {
    return next(new ApiError(404, responseMessage.notFound('Question')))
  }
  await question.destroy()
  return res.status(200).json(new ApiResponse(200, null, responseMessage.deleted('Question')))
})

/** Reorder questions */
const reorderQuestions = asyncHandler(async (req, res, next) => {
  const { questionIds } = req.body
  if (!questionIds || !Array.isArray(questionIds)) {
    return next(new ApiError(400, 'Question IDs are required'))
  }

  const transaction = await sequelize.transaction()
  try {
    for (let i = 0; i < questionIds.length; i++) {
      await TestQuestionModel.update(
        { question_order: i + 1 },
        { where: { id: questionIds[i] }, transaction }
      )
    }
    await transaction.commit()
    return res.status(200).json(new ApiResponse(200, null, responseMessage.updated('Question order')))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

export default {
  getQuestionsByTestId,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
}
