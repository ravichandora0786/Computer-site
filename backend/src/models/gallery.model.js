import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { GALLERY_TYPE_ENUM, GALLERY_CATEGORY_ENUM } from '../utils/constants/index.js'

const GalleryModel = sequelize.define(
  'Gallery',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...GALLERY_TYPE_ENUM),
    },
    category: {
      type: DataTypes.ENUM(...GALLERY_CATEGORY_ENUM),
      defaultValue: "building"
    },
    link: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
    tableName: 'galleries',
  }
)

export default GalleryModel
