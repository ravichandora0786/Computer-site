import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const CertificateModel = sequelize.define(
  'Certificate',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    certificate_number: {
      type: DataTypes.STRING,
      allowNull: true, // Null until approved
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id',
      },
    },
    custom_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The name user wants on the certificate',
    },
    issue_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
  },
  {
    timestamps: true,
    tableName: 'certificates',
  }
)

export default CertificateModel
