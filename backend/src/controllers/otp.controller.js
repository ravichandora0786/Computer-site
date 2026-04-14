import { asyncHandler } from '../utils/asyncHandler.js'
import sequelize from '../config/database.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { responseMessage } from '../utils/responseMessage.js'
import { OtpModel } from '../models/associations.js'

/** Send OTP (Mock for now) */
const sendOtp = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const { email } = req.body
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    await OtpModel.create({ email, otp }, { transaction })
    await transaction.commit()
    
    return res
      .status(200)
      .json(new ApiResponse(200, { email }, 'OTP sent successfully'))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

/** Verify OTP */
const verifyOtp = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const { email, otp } = req.body
    const record = await OtpModel.findOne({ where: { email, otp }, transaction })
    
    if (!record) {
      await transaction.rollback()
      return next(new ApiError(400, 'Invalid OTP'))
    }
    
    await record.destroy({ transaction })
    await transaction.commit()
    
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'OTP verified successfully'))
  } catch (error) {
    if (transaction) await transaction.rollback()
    return next(error)
  }
})

export default {
  sendOtp,
  verifyOtp,
}
