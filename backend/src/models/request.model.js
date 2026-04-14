import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { REQUEST_STATUS_ENUM } from '../utils/constants/index.js'

const RequestModel = sequelize.define(
  'Request',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    requestedData: {
      type: DataTypes.TEXT,
      field: 'requested_data',
    },
    requestResult: {
      type: DataTypes.TEXT,
      field: 'request_result',
    },
    requestType: {
      type: DataTypes.STRING,
      field: 'request_type',
    },
    handleBy: {
      type: DataTypes.UUID,
      field: 'handle_request_by',
    },
    userId: {
      type: DataTypes.UUID,
      field: 'user_id',
    },
    readRequestStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'read_request_status',
    },
    status: {
      type: DataTypes.ENUM(...REQUEST_STATUS_ENUM),
      defaultValue: 'pending',
    },
  },
  {
    timestamps: true,
    tableName: 'requests',
  }
)

export default RequestModel
