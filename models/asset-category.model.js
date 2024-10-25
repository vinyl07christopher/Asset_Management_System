const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const assetCategorySchema = sequelize.define(
  "AssetCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = assetCategorySchema;
