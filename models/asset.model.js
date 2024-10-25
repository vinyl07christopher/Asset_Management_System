const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const AssetCategory = require("./asset-category.model");
const Employee = require("./employee.model");

const assetSchema = sequelize.define(
  "Asset",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    uniqueId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("in stock", "issued", "scrapped"),
      defaultValue: "in stock",
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    assetCategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: AssetCategory,
        key: "id",
      },
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Employee,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = assetSchema;
