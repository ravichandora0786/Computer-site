import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { QUESTION_TYPE_ENUM } from '../utils/constants/index.js'

const TestQuestionModel = sequelize.define(
  'TestQuestion',
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
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    question_type: {
      type: DataTypes.ENUM(...QUESTION_TYPE_ENUM),
      defaultValue: 'single_choice',
    },
    marks: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    question_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    randomize_options: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: 'test_questions',
  }
)

export default TestQuestionModel
