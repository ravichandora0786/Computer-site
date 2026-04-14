import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { FAQModel } from '../models/associations.js'

const getFAQs = asyncHandler(async (req, res) => {
  const where = req.query.all === 'true' ? {} : { is_active: true }
  const { count, rows: faqs } = await FAQModel.findAndCountAll({
    where,
    order: [['sort_order', 'ASC'], ['createdAt', 'DESC']],
  })
  return res.status(200).json(new ApiResponse(200, { items: faqs, total: count }, responseMessage.fetched('FAQs')))
})

const getFAQById = asyncHandler(async (req, res, next) => {
  const faq = await FAQModel.findByPk(req.params.id)
  if (!faq) return next(new ApiError(404, responseMessage.notFound('FAQ')))
  return res.status(200).json(new ApiResponse(200, faq, responseMessage.fetched('FAQ')))
})

const createFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQModel.create(req.body)
  return res.status(201).json(new ApiResponse(201, faq, responseMessage.created('FAQ')))
})

const updateFAQ = asyncHandler(async (req, res, next) => {
  const { id } = req.body
  if (!id) return next(new ApiError(400, "FAQ ID is required"))
  const faq = await FAQModel.findByPk(id)
  if (!faq) return next(new ApiError(404, responseMessage.notFound('FAQ')))
  await faq.update(req.body)
  return res.status(200).json(new ApiResponse(200, faq, responseMessage.updated('FAQ')))
})

const deleteFAQ = asyncHandler(async (req, res, next) => {
  const { id } = req.body
  if (!id) return next(new ApiError(400, "FAQ ID is required"))
  const faq = await FAQModel.findByPk(id)
  if (!faq) return next(new ApiError(404, responseMessage.notFound('FAQ')))
  await faq.destroy()
  return res.status(200).json(new ApiResponse(200, null, responseMessage.deleted('FAQ')))
})

const reorderFAQs = asyncHandler(async (req, res, next) => {
  const { ids } = req.body
  if (!ids || !Array.isArray(ids)) return next(new ApiError(400, "IDs array is required"))
  const updatePromises = ids.map((id, index) => FAQModel.update({ sort_order: index + 1 }, { where: { id } }))
  await Promise.all(updatePromises)
  return res.status(200).json(new ApiResponse(200, null, 'FAQs reordered successfully'))
})

export default { getFAQs, getFAQById, createFAQ, updateFAQ, deleteFAQ, reorderFAQs }
