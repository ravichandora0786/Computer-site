import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const TestAttemptModel = sequelize.define(
  'TestAttempt',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    test_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    total_questions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    correct_answers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    obtained_marks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    is_passed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    started_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    submitted_at: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    tableName: 'test_attempts',
  }
)

export default TestAttemptModel
