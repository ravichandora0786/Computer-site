import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CourseRatingModel = sequelize.define('CourseRating', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  course_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: DataTypes.TEXT
}, {
  timestamps: true,
  tableName: 'course_ratings',
  indexes: [{ unique: true, fields: ['course_id', 'user_id'] }]  // One rating per user per course
});

export default CourseRatingModel;
