import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { COURSE_STATUS_ENUM } from '../utils/constants/index.js'

const LessonModel = sequelize.define(
  'Lesson',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    short_description: {
      type: DataTypes.TEXT,
    },
    lesson_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    duration_min: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    is_preview: {
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
    tableName: 'lessons',
  }
)

export default LessonModel
