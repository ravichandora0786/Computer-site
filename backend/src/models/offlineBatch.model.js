import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { COURSE_STATUS_ENUM } from '../utils/constants/index.js'

const OfflineBatchModel = sequelize.define(
  'OfflineBatch',
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
    batch_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    class_days: {
      type: DataTypes.STRING, // e.g., "Mon, Wed, Fri"
    },
    start_time: {
      type: DataTypes.TIME,
    },
    end_time: {
      type: DataTypes.TIME,
    },
    location: {
      type: DataTypes.STRING,
    },
    seat_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM(...COURSE_STATUS_ENUM),
      defaultValue: 'draft',
    },
  },
  {
    timestamps: true,
    tableName: 'offline_batches',
  }
)

export default OfflineBatchModel
