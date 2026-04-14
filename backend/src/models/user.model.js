import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { USER_STATUS_ENUM, USER_TYPE_ENUM } from '../utils/constants/index.js'

const UserModel = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    father_name: {
      type: DataTypes.STRING,
    },
    mother_name: {
      type: DataTypes.STRING,
    },
    nationality: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    register_by: {
      type: DataTypes.STRING,
    },
    aadhar_card_number: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_img: {
      type: DataTypes.STRING,
    },
    account_status: {
      type: DataTypes.ENUM(...USER_STATUS_ENUM),
      defaultValue: 'active',
    },
    gender: {
      type: DataTypes.STRING,
    },
    date_of_birth: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    distAndCity: {
      type: DataTypes.STRING,
    },
    postal_code: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    designation: {
      type: DataTypes.STRING,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    tableName: 'users',
  }
)

export default UserModel
