import express from 'express'
import authController from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/adminLogin', authController.adminLogin)
authRouter.post('/login', authController.userLogin)
authRouter.post('/register', authController.userRegister)

export default authRouter
