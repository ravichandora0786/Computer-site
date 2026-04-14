import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { AboutSectionModel } from '../models/associations.js'

const getAboutSections = asyncHandler(async (req, res) => {
  const where = req.query.all === 'true' ? {} : { is_active: true }
  const sections = await AboutSectionModel.findAll({
    where,
    order: [['is_hero_section', 'DESC'], ['sort_order', 'ASC']],
  })
  return res.status(200).json(new ApiResponse(200, sections, responseMessage.fetched('About Sections')))
})

const getAboutSectionById = asyncHandler(async (req, res, next) => {
  const section = await AboutSectionModel.findByPk(req.params.id)
  if (!section) return next(new ApiError(404, responseMessage.notFound('About Section')))
  return res.status(200).json(new ApiResponse(200, section, responseMessage.fetched('About Section')))
})

const createAboutSection = asyncHandler(async (req, res) => {
  if (req.body.is_hero_section === true) {
    await AboutSectionModel.update({ is_hero_section: false }, { where: {} })
  }
  const section = await AboutSectionModel.create(req.body)
  return res.status(201).json(new ApiResponse(201, section, responseMessage.created('About Section')))
})

const updateAboutSection = asyncHandler(async (req, res, next) => {
  const { id } = req.body
  if (!id) return next(new ApiError(400, "Section ID is required"))
  const section = await AboutSectionModel.findByPk(id)
  if (!section) return next(new ApiError(404, responseMessage.notFound('About Section')))
  
  if (req.body.is_hero_section === true) {
    await AboutSectionModel.update({ is_hero_section: false }, { where: {} })
  }

  await section.update(req.body)
  return res.status(200).json(new ApiResponse(200, section, responseMessage.updated('About Section')))
})

const deleteAboutSection = asyncHandler(async (req, res, next) => {
  const { id } = req.body
  if (!id) return next(new ApiError(400, "Section ID is required"))
  const section = await AboutSectionModel.findByPk(id)
  if (!section) return next(new ApiError(404, responseMessage.notFound('About Section')))
  await section.destroy()
  return res.status(200).json(new ApiResponse(200, null, responseMessage.deleted('About Section')))
})

const reorderAboutSections = asyncHandler(async (req, res, next) => {
  const { ids } = req.body
  if (!ids || !Array.isArray(ids)) return next(new ApiError(400, "IDs array is required"))
  const updatePromises = ids.map((id, index) => AboutSectionModel.update({ sort_order: index + 1 }, { where: { id } }))
  await Promise.all(updatePromises)
  return res.status(200).json(new ApiResponse(200, null, 'Sections reordered successfully'))
})

export default { getAboutSections, getAboutSectionById, createAboutSection, updateAboutSection, deleteAboutSection, reorderAboutSections }
