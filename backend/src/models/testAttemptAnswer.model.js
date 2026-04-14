import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const TestAttemptAnswerModel = sequelize.define(
  'TestAttemptAnswer',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    attempt_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    question_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    selected_option_id: {
      type: DataTypes.UUID,
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    marks_obtained: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: 'test_attempt_answers',
  }
)

export default TestAttemptAnswerModel
