import express from 'express'
import otpController from '../controllers/otp.controller.js'

const otpRouter = express.Router()

otpRouter.post('/send', otpController.sendOtp)
otpRouter.post('/verify', otpController.verifyOtp)

export default otpRouter
