import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ActivityPermissionModel = sequelize.define(
  "ActivityPermission",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    activityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "activities",
        key: "id",
      },
    },
    permissionIds: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "activityPermissions",
  }
);

export default ActivityPermissionModel;
