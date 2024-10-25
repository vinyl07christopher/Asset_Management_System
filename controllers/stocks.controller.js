const { Sequelize } = require("sequelize");
const AssetCategory = require("../models/asset-category.model");
const Asset = require("../models/asset.model");

const stock = async (req, res) => {
  try {
    const assetsInStock = await Asset.findAll({ where: { status: "in stock" } });
    res.json({ message: "Stock retrieved successfully", data: assetsInStock });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving stock" });
  }
};

const stockByBranch = async (req, res) => {
  const { branch } = req.params;

  try {
    const assetsInStock = await Asset.findAll({
      where: { status: "in stock", branch },
      include: { model: AssetCategory, as: "category", attributes: ["id", "name"] },
    });
    res.json({ message: "Stock retrieved successfully", data: assetsInStock });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving stock" });
  }
};

const stockByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const assetsInStock = await Asset.findAll({
      where: { status: "in stock", assetCategoryId: category },
      include: [{ model: AssetCategory, as: "category", attributes: ["id", "name"] }],
    });
    res.json({ message: "Stock retrieved successfully", data: assetsInStock });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving stock" });
  }
};

const summary = async (req, res) => {
  try {
    const stockSummary = await Asset.findAll({
      where: { status: "in stock" },
      attributes: [
        "branch",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "totalAssets"],
        [Sequelize.fn("SUM", Sequelize.col("value")), "totalValue"],
      ],
      group: "branch",
      order: ["branch"],
    });
    res.json({ message: "Stock retrieved successfully", data: stockSummary });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving stock" });
  }
};

module.exports = { stock, stockByBranch, stockByCategory, summary };
