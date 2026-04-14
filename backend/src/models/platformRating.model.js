import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PlatformRatingModel = sequelize.define('PlatformRating', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {  // Optional for guests
    type: DataTypes.UUID,
    allowNull: true
  },
  ip_address: {  // Guest tracking (hashed for privacy)
    type: DataTypes.STRING(64),
    allowNull: true
  },
  session_id: {  // Browser session
    type: DataTypes.STRING(255),
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: DataTypes.TEXT
}, {
  timestamps: true,
  tableName: 'platform_ratings',
  indexes: [
    { unique: true, fields: ['user_id', 'ip_address', 'session_id'], name: 'compositeIndex' }  // Flexible unique constraint
  ]
});

export default PlatformRatingModel;
