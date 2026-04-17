import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import UserModel from '../models/user.model.js'
import RoleModel from '../models/role.model.js'
import UserCourseModel from '../models/userCourse.model.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required")
  }

  // Find user by email
  const user = await UserModel.findOne({
    where: { email },
    include: [{ model: RoleModel, as: 'role' }]
  })

  if (!user) {
    throw new ApiError(401, "Invalid email or password")
  }

  // Check user type for admin login (optional but good idea)
  if (user.role?.type !== 'admin') {
    throw new ApiError(403, "Access denied. Admin only.")
  }

  // Check account status
  if (user.account_status !== 'active') {
    throw new ApiError(403, "Account is disabled")
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password")
  }

  // Sign token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      userType: user.role?.type,
      role: user.role?.name || ''
    }, 
    process.env.JWT_SECRET || 'super_secret', 
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  )

  // Remove password from response
  const userResponse = user.toJSON()
  delete userResponse.password

  return res.status(200).json(
    new ApiResponse(200, {
      user: userResponse,
      accessToken: token
    }, "Login successful")
  )
})

export const userRegister = asyncHandler(async (req, res) => {
  const { user_name, email, password, phone, gender, date_of_birth } = req.body;

  if (!user_name || !email || !password) {
    throw new ApiError(400, "Username, email, and password are required");
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Find student role
  const studentRole = await RoleModel.findOne({ where: { type: 'student' } });
  if (!studentRole) {
    throw new ApiError(500, "Student role not found in the system");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await UserModel.create({
    user_name,
    email,
    password: hashedPassword,
    phone,
    gender,
    date_of_birth,
    role_id: studentRole.id,
    account_status: "active",
  });


  // Fetch created user with role
  const user = await UserModel.findByPk(newUser.id, {
    include: [
      { model: RoleModel, as: 'role' },
      { model: UserCourseModel, as: 'enrolled_courses' }
    ]
  });

  // Sign token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      userType: user.role?.type,
      role: user.role?.name || ''
    }, 
    process.env.JWT_SECRET || 'super_secret', 
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const userResponse = user.toJSON();
  delete userResponse.password;

  return res.status(201).json(
    new ApiResponse(201, {
      user: userResponse,
      accessToken: token
    }, "Registration successful")
  );
});

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find user by email
  const user = await UserModel.findOne({
    where: { email },
    include: [
      { model: RoleModel, as: 'role' },
      { model: UserCourseModel, as: 'enrolled_courses' }
    ]
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Check account status
  if (user.account_status !== 'active') {
    throw new ApiError(403, "Account is disabled");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Sign token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      userType: user.role?.type,
      role: user.role?.name || ''
    }, 
    process.env.JWT_SECRET || 'super_secret', 
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const userResponse = user.toJSON();
  delete userResponse.password;

  return res.status(200).json(
    new ApiResponse(200, {
      user: userResponse,
      accessToken: token
    }, "Login successful")
  );
});

export default {
  adminLogin,
  userLogin,
  userRegister
}
