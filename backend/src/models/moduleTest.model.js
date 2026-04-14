import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { COURSE_STATUS_ENUM } from '../utils/constants/index.js'

const ModuleTestModel = sequelize.define(
  'ModuleTest',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    passing_percentage: {
      type: DataTypes.INTEGER,
      defaultValue: 40,
    },
    total_marks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    duration_min: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    max_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    },
    status: {
      type: DataTypes.ENUM(...COURSE_STATUS_ENUM),
      defaultValue: 'draft',
    },
  },
  {
    timestamps: true,
    tableName: 'module_tests',
  }
)

export default ModuleTestModel
