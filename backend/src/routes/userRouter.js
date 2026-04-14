import express from 'express'
import { authenticateUser } from '../middlewares/authMiddleware.js'
import userController from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.get('/mentors', userController.getMentors || ((req, res) => res.json({data: []})))

userRouter.use(authenticateUser)

userRouter.get('/', userController.getUsers)
userRouter.get('/list', userController.getUsers)
userRouter.get('/getById/:id', userController.getUserById)
userRouter.post('/create', userController.createUser)
userRouter.post('/update', userController.updateUser)
userRouter.post('/delete', userController.deleteUser)
userRouter.post('/updateStatus', userController.updateUser) // Reusing update for status if needed
userRouter.get('/options', userController.getUserOptions)

export default userRouter
