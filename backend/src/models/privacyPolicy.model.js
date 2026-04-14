import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PrivacyPolicyModel = sequelize.define('PrivacyPolicy', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Privacy Policy'
  },
  content_html: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  version: {
    type: DataTypes.STRING,
    defaultValue: '1.0'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'privacy_policies'
});

export default PrivacyPolicyModel;
