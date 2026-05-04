import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const LessonPageModel = sequelize.define(
  'LessonPage',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    lesson_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    html_content: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    page_order: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    is_preview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    required_time: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
      comment: 'Mandatory stay duration in minutes'
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      defaultValue: 'published',
    },
  },
  {
    timestamps: true,
    tableName: 'lesson_pages',
  }
)

export default LessonPageModel
