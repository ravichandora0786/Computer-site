import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { PrivacyPolicyModel } from '../models/associations.js'

const getPolicies = asyncHandler(async (req, res) => {
  const where = req.query.all === 'true' ? {} : { is_active: true }
  const policies = await PrivacyPolicyModel.findAll({
    where,
    order: [['version', 'DESC']],
  })
  return res.status(200).json(new ApiResponse(200, policies, responseMessage.fetched('Privacy Policies')))
})

const getPolicyById = asyncHandler(async (req, res, next) => {
  const policy = await PrivacyPolicyModel.findByPk(req.params.id)
  if (!policy) return next(new ApiError(404, responseMessage.notFound('Privacy Policy')))
  return res.status(200).json(new ApiResponse(200, policy, responseMessage.fetched('Privacy Policy')))
})

const createPolicy = asyncHandler(async (req, res) => {
  // New policies are always created as inactive (false)
  const policy = await PrivacyPolicyModel.create({
    ...req.body,
    is_active: false
  })
  return res.status(201).json(new ApiResponse(201, policy, responseMessage.created('Privacy Policy')))
})

const updatePolicy = asyncHandler(async (req, res, next) => {
  const { id, is_active } = req.body
  if (!id) return next(new ApiError(400, "Policy ID is required"))
  const policy = await PrivacyPolicyModel.findByPk(id)
  if (!policy) return next(new ApiError(404, responseMessage.notFound('Privacy Policy')))

  // If activating this policy, deactivate all others first
  if (is_active === true) {
    await PrivacyPolicyModel.update({ is_active: false }, { where: { is_active: true } })
  }

  await policy.update(req.body)
  return res.status(200).json(new ApiResponse(200, policy, responseMessage.updated('Privacy Policy')))
})

const deletePolicy = asyncHandler(async (req, res, next) => {
  const { id } = req.body
  if (!id) return next(new ApiError(400, "Policy ID is required"))
  const policy = await PrivacyPolicyModel.findByPk(id)
  if (!policy) return next(new ApiError(404, responseMessage.notFound('Privacy Policy')))

  // Prevent deleting active policy
  if (policy.is_active) {
    return next(new ApiError(400, "Active policy cannot be deleted. Please deactivate it first."))
  }

  await policy.destroy()
  return res.status(200).json(new ApiResponse(200, null, responseMessage.deleted('Privacy Policy')))
})

const reorderPolicies = asyncHandler(async (req, res, next) => {
  const { ids } = req.body
  if (!ids || !Array.isArray(ids)) return next(new ApiError(400, "IDs array is required"))
  const updatePromises = ids.map((id, index) => PrivacyPolicyModel.update({ sort_order: index + 1 }, { where: { id } }))
  await Promise.all(updatePromises)
  return res.status(200).json(new ApiResponse(200, null, 'Policies reordered successfully'))
})

export default { getPolicies, getPolicyById, createPolicy, updatePolicy, deletePolicy, reorderPolicies }
