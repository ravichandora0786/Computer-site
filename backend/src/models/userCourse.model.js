import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { ORDER_STATUS_ENUM, COURSE_TYPE_ENUM } from '../utils/constants/index.js'

const UserCourseModel = sequelize.define(
  'UserCourse',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'course_id',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    startDate: {
      type: DataTypes.DATE,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      field: 'end_date',
    },
    status: {
      type: DataTypes.ENUM(...ORDER_STATUS_ENUM),
      defaultValue: 'active',
    },
  },
  {
    timestamps: true,
    tableName: 'user_courses',
  }
)

export default UserCourseModel
