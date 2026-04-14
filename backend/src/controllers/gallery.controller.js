import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { GalleryModel } from '../models/associations.js'
import path from 'path'
import fs from 'fs'

/** Get all gallery items with pagination and filters */
const getGalleryItems = asyncHandler(async (req, res, next) => {
  const { category, type } = req.query
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const offset = (page - 1) * limit

  const where = {}
  if (category && category !== 'all') {
    where.category = category
  }
  if (type && type !== 'all') {
    where.type = type
  }

  const { count, rows: items } = await GalleryModel.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  })

  const totalPages = Math.ceil(count / limit)

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        items,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      responseMessage.fetched('Gallery items')
    )
  )
})

/** Add new gallery item (Create only) */
const addGalleryItem = asyncHandler(async (req, res, next) => {
  const { title, type, category, link, description } = req.body
  
  if (!title || !type || !category) {
    return next(new ApiError(400, "Title, Type and Category are required"))
  }

  const galleryItem = await GalleryModel.create({
    title,
    type,
    category,
    link,
    description
  })

  return res
    .status(201)
    .json(new ApiResponse(201, galleryItem, responseMessage.created('Gallery item')))
})

/** Delete gallery item with file cleanup */
const deleteGalleryItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params || req.body

  const item = await GalleryModel.findByPk(id)
  if (!item) {
    return next(new ApiError(404, responseMessage.notFound('Gallery item')))
  }

  // Physical file cleanup if it's a local file
  if (item.link && !item.link.startsWith('http')) {
    try {
      const relativePath = item.link.replace(/^\/media/, 'public/media');
      const absolutePath = path.join(process.cwd(), relativePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    } catch (err) {
      console.error(`Failed to delete physical file: ${item.link}`, err);
    }
  }

  await item.destroy()

  return res
    .status(200)
    .json(new ApiResponse(200, null, responseMessage.deleted('Gallery item')))
})

export default {
  getGalleryItems,
  addGalleryItem,
  deleteGalleryItem
}
