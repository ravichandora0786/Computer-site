import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const CourseMediaModel = sequelize.define(
  'CourseMedia',
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
    media_type: {
      type: DataTypes.ENUM('image', 'video', 'youtube'),
      allowNull: false,
      defaultValue: 'image',
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumbnail_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: 'course_media',
  }
)

export default CourseMediaModel
