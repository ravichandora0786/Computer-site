import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { USER_STATUS_ENUM } from '../utils/constants/index.js'

const CourseCategoryModel = sequelize.define(
  'CourseCategory',
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
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: 'course_categories',
  }
)

export default CourseCategoryModel
