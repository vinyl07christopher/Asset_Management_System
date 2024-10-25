const AssetCategory = require("../models/asset-category.model");

const getAll = async (req, res) => {
  try {
    const assetCategories = await AssetCategory.findAll();
    res.json({ message: "Asset category data retrieved successfully", data: assetCategories });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data" });
  }
};

const get = async (req, res) => {
  const { id } = req.params;
  try {
    const assetCategory = await AssetCategory.findByPk(id);
    if (!assetCategory) return res.status(404).json({ message: "Asset category not found" });

    res.json({ message: "Asset category data retrieved successfully", data: assetCategory });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data" });
  }
};

const create = async (req, res) => {
  const { name } = req.body;
  try {
    const newAssetCategory = await AssetCategory.create({ name });
    res.json({ message: "Asset category stored successfully", data: newAssetCategory });
  } catch (error) {
    res.status(500).json({ message: "Error while storing data" });
  }
};

const update = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    const assetCategory = await AssetCategory.findByPk(id);
    if (!assetCategory) return res.status(404).json({ message: "Asset category not found" });

    name && (assetCategory.name = name);
    await assetCategory.save();

    res.json({ message: "Asset category updated successfully", data: assetCategory });
  } catch (error) {
    res.status(500).json({ message: "Error while updating data" });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const numOfRowsAffected = await AssetCategory.destroy({ where: { id } });
    if (numOfRowsAffected < 1) return res.status(404).json({ message: "Asset category not found" });
    res.json({ message: "Asset category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting data" });
  }
};

module.exports = {
  get,
  getAll,
  create,
  update,
  remove,
};
