const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const Asset = require("./asset.model");
const Employee = require("./employee.model");

const assetHistorySchema = sequelize.define(
  "AssetHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    assetId: {
      type: DataTypes.INTEGER,
      references: {
        model: Asset,
        key: "id",
      },
    },
    action: {
      type: DataTypes.ENUM("purchase", "issue", "return", "scrap"),
      allowNull: false,
    },
    actionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Employee,
        key: "id",
      },
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = assetHistorySchema;
