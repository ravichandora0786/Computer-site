import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { COURSE_STATUS_ENUM } from '../utils/constants/index.js'

const CourseModuleModel = sequelize.define(
  'CourseModule',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    module_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_free_preview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM(...COURSE_STATUS_ENUM),
      defaultValue: 'draft',
    },
  },
  {
    timestamps: true,
    tableName: 'course_modules',
  }
)

export default CourseModuleModel
