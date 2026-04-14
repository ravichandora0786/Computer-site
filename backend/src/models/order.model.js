import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { ORDER_STATUS_ENUM } from '../utils/constants/index.js'

const OrderModel = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'course_id',
    },
    status: {
      type: DataTypes.ENUM(...ORDER_STATUS_ENUM),
      defaultValue: 'active',
    },
  },
  {
    timestamps: true,
    tableName: 'orders',
  }
)

export default OrderModel
