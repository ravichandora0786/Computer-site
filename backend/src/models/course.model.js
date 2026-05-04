import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { COURSE_STATUS_ENUM, ACCESS_TYPE_ENUM, COURSE_MODE_ENUM } from '../utils/constants/index.js'

const CourseModel = sequelize.define(
  'Course',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    overview: {
      type: DataTypes.TEXT,
    },
    publish_date: {
      type: DataTypes.STRING,
    },
    course_level: {
      type: DataTypes.STRING,
    },
    expire_date: {
      type: DataTypes.STRING,
    },
    course_mode: {
      type: DataTypes.ENUM(...COURSE_MODE_ENUM),
      allowNull: false,
      defaultValue: 'Online',
    },
    access_type: {
      type: DataTypes.ENUM(...ACCESS_TYPE_ENUM),
      defaultValue: 'Free',
    },
    monthly_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    yearly_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    fixed_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    discount_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    course_category_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    author: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...COURSE_STATUS_ENUM),
      defaultValue: 'draft',
    },
  },
  {
    timestamps: true,
    tableName: 'courses',
  }
)

export default CourseModel
