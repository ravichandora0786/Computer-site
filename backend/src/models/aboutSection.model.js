import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AboutSectionModel = sequelize.define('AboutSection', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  is_hero_section: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  subtitle: DataTypes.STRING(500),
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'about_sections',
  indexes: [{ fields: ['sort_order'] }]
});

export default AboutSectionModel;
