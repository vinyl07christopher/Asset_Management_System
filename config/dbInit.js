const sequelize = require("./sequelize");
const Employee = require("../models/employee.model");
const Asset = require("../models/asset.model");
const AssetCategory = require("../models/asset-category.model");
const AssetHistory = require("../models/asset-history.model");

Asset.belongsTo(AssetCategory, {
  foreignKey: "assetCategoryId",
  as: "category",
});

Asset.hasMany(AssetHistory, {
  foreignKey: "assetId",
  as: "histories",
});

AssetHistory.belongsTo(Asset, {
  foreignKey: "assetId",
  as: "asset",
});

Asset.belongsTo(Employee, {
  foreignKey: "employeeId",
  as: "employee",
});
AssetHistory.belongsTo(Employee, {
  foreignKey: "employeeId",
  as: "employee",
});

const dbInit = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Databases synced successfully");
  } catch (error) {
    console.error("Error syncing the database:", error);
  }
};

module.exports = dbInit;
