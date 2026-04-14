import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const UserOtherDetailsModel = sequelize.define(
  'UserOtherDetails',
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
    // Add other fields as needed based on site_full\demo_backend\models\UserOtherDetails.js
    additionalInfo: {
      type: DataTypes.TEXT,
      field: 'additional_info',
    },
  },
  {
    timestamps: true,
    tableName: 'user_other_details',
  }
)

export default UserOtherDetailsModel
