import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const UserPageProgressModel = sequelize.define(
  'UserPageProgress',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    page_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    lesson_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    time_spent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Time spent on this page in seconds',
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'user_page_progress',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'page_id'],
      },
    ],
  }
)

export default UserPageProgressModel
