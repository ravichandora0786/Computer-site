import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { CertificateModel, CourseModel, UserModel } from '../models/associations.js'
import { Op } from 'sequelize'

/** Helper to generate next sequential certificate number */
const getNextCertificateNumber = async () => {
  const lastCert = await CertificateModel.findOne({
    where: { 
      certificate_number: { [Op.not]: null } 
    },
    order: [['createdAt', 'DESC']]
  })
  
  let nextNum = 1
  if (lastCert && lastCert.certificate_number) {
    const lastNumMatch = lastCert.certificate_number.match(/\d+$/)
    if (lastNumMatch) {
      nextNum = parseInt(lastNumMatch[0]) + 1
    }
  }
  
  return `CERT-${String(nextNum).padStart(4, '0')}`
}

/** Get all certificates (Admin Only) */
const getAllCertificates = asyncHandler(async (req, res, next) => {
  const certificates = await CertificateModel.findAll({
    include: [
      { model: CourseModel, as: 'course', attributes: ['title', 'id'] },
      { model: UserModel, as: 'user', attributes: ['user_name', 'email', 'id'] }
    ],
    order: [['createdAt', 'DESC']]
  })
  return res
    .status(200)
    .json(new ApiResponse(200, certificates, 'All certificates fetched'))
})

/** Get certificates for current user */
const getUserCertificates = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  const certificates = await CertificateModel.findAll({
    where: { userId },
    include: [{ model: CourseModel, as: 'course', attributes: ['title'] }]
  })
  return res
    .status(200)
    .json(new ApiResponse(200, certificates, 'User certificates fetched'))
})

/** User Applies for Certificate (Paid Courses Only) */
const applyForCertificate = asyncHandler(async (req, res, next) => {
  const { courseId, custom_name } = req.body
  const userId = req.user.id

  // Check if already applied
  const existing = await CertificateModel.findOne({ where: { userId, courseId } })
  if (existing) {
    return next(new ApiError(400, 'Certificate application already exists for this course'))
  }

  const application = await CertificateModel.create({
    userId,
    courseId,
    custom_name,
    status: 'pending'
  })

  return res
    .status(201)
    .json(new ApiResponse(201, application, 'Certificate application submitted successfully'))
})

/** Admin Approves Certificate (Generates Serial Number) */
const approveCertificate = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const certificate = await CertificateModel.findByPk(id)
  if (!certificate) {
    return next(new ApiError(404, 'Certificate application not found'))
  }

  if (certificate.status !== 'pending') {
    return next(new ApiError(400, `Certificate is already ${certificate.status}`))
  }

  const certificate_number = await getNextCertificateNumber()

  certificate.certificate_number = certificate_number
  certificate.status = 'approved'
  certificate.issue_date = new Date()
  await certificate.save()

  return res
    .status(200)
    .json(new ApiResponse(200, certificate, 'Certificate approved and serial number generated'))
})

/** Admin Generates Certificate Directly (Paid Courses Only) */
const generateCertificate = asyncHandler(async (req, res, next) => {
  const { userId, courseId, custom_name } = req.body

  // Check if already exists
  const existing = await CertificateModel.findOne({ where: { userId, courseId } })
  if (existing) {
    return next(new ApiError(400, 'Certificate record already exists for this course'))
  }

  const certificate_number = await getNextCertificateNumber()

  const certificate = await CertificateModel.create({
    userId,
    courseId,
    custom_name,
    certificate_number,
    status: 'approved',
    issue_date: new Date()
  })

  return res
    .status(201)
    .json(new ApiResponse(201, certificate, 'Certificate generated successfully'))
})

export default {
  getAllCertificates,
  getUserCertificates,
  applyForCertificate,
  approveCertificate,
  generateCertificate
}
