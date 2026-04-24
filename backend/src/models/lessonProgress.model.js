import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const LessonProgressModel = sequelize.define(
  'LessonProgress',
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
    module_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    lesson_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completed_at: {
      type: DataTypes.DATE,
    },
    pages_data: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: 'Stores page progress: { pageId: { time_spent, is_completed, completed_at } }',
    },
  },
  {
    timestamps: true,
    tableName: 'lesson_progress',
  }
)

export default LessonProgressModel
