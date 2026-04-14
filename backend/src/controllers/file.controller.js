import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import fs from 'fs'
import path from 'path'

/**
 * Handle unified file upload and return the accessible URL.
 * Supports image and video formats for the Studio Media Library.
 */
const uploadFile = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError(400, "No file uploaded or invalid file format"))
  }

  // Construct the relative path accessible via express.static('public/media')
  // We use '/' for consistent web URIs regardless of OS
  const subFolder = req.query.folder || "general";
  const fileUrl = `/media/${subFolder}/${req.file.filename}`

  return res
    .status(200)
    .json(new ApiResponse(200, { url: fileUrl }, responseMessage.created('File')))
})

/**
 * Cleanup physical files from the storage during a failed deployment rollback.
 */
const cleanupFiles = asyncHandler(async (req, res, next) => {
  const { files } = req.body

  if (files && Array.isArray(files)) {
    files.forEach(fileUrl => {
      try {
        const relativePath = fileUrl.replace(/^\/media/, 'public/media')
        const absolutePath = path.join(process.cwd(), relativePath)
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath)
          console.log(`Physically purged orphaned file: ${fileUrl}`)
        }
      } catch (err) {
        console.error(`Failed to purge orphaned file: ${fileUrl}`, err)
      }
    })
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Orphaned assets purged successfully'))
})

export default {
  uploadFile,
  cleanupFiles,
}
