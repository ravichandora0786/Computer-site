import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BlockedTokenModel = sequelize.define(
  "BlockedToken",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "blockedTokens",
    timestamps: true,
    paranoid: true,
  }
);

export default BlockedTokenModel;
